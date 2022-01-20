export async function isUserAuth() {
  const res = await fetch("/is-user-auth", {
    method: "POST",
  });

  return await res.json() ? true : false;
}
