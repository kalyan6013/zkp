function Migrations() {
  let owner;
  let last_completed_migration;

  // modifier restricted() {
  //   if (msg.sender == owner) _;
  // }

  function Migrations() {
    owner = msg.sender;
  }

  function setCompleted(completed) {
    last_completed_migration = completed;
  }

  function upgrade(new_address) {
    Migrations.call(upgraded) = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
