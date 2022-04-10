/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

exports.shorthands = undefined;

exports.up = async (pgm) => {
  // membuat user baru.
  const apo = "'";
  let id = `user-${nanoid(16)}`;
  id = apo + id + apo;

  const password = 'old_notes';
  let hashedPassword = await bcrypt.hash(password, 10);
  hashedPassword = apo + hashedPassword + apo;

  pgm.sql(`INSERT INTO users(id, username, password, fullname) VALUES (${id}, 'old_notes', ${hashedPassword}, 'old notes')`);

  // mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = NULL");

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
