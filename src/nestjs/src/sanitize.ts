function sanitizeObject(obj: any, keysToKeep: string[]): any {
	obj.forEach((ob) => {
		Object.getOwnPropertyNames(ob).forEach((key) => {
			if (!keysToKeep.includes(key)) delete ob[key];
		});
	});
    return obj;
}

export default sanitizeObject;
