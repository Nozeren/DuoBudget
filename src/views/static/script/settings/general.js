let users;
window.onload = async function () {
  users = await getUsers();
  await updateUsers();
  await updateAccounts();
};
