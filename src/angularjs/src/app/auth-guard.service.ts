export const authGuardService = async () => {
	const jwt_token = localStorage.getItem("access_token");

	if (!jwt_token)
	{
		console.log("[authGuardService] no token");
		return false;
	}
	const res = await fetch('/api/auth/profile', {
		method: 'GET',
		headers:  {
			'Authorization': 'Bearer ' + jwt_token
		},
		mode: 'cors'
	});
	if (res.status !== 200)
	{
		console.log("[authGuardService] bad token");
		return false;
	}
	return true;
};
