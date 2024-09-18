TOKEN_USERNAME && (
  <button
    onClick={
      !userData.followers || !checkingUsername() ? handleFollow : handleUnfollow
    }
    className={`py-2 px-4 rounded text-white font-semibold ${
      !userData.followers || !checkingUsername()
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-red-600 hover:bg-red-700"
    }`}
  >
    {!userData.followers || !checkingUsername() ? "Follow" : "Unfollow"}
  </button>
);

userData.followers.includes(TOKEN_USERNAME);
for (let i = 0; i < userData.followers.length(); i++) {
  if (userData.followers[i].follower_username == TOKEN_USERNAME) {
    return true;
  }
}
return false;
