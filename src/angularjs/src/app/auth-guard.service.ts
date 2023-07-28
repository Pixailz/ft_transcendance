export const authGuardService = async () => {
	const jwt_token = localStorage.getItem("access_token");

	if (!jwt_token)
	{
		console.log("[authGuardService] no token");
		return false;
	}

	const res = await fetch('/api/auth/ft_verify?access_token=' + jwt_token,{
		method: 'GET',
		mode: 'cors'
	});
	if (res.status !== 200)
	{
		console.log("[authGuardService] bad token");
		return false;
	}
	return true;
};
