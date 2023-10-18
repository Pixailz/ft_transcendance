export class ReplaceNickname {
    replace_nickname(name: string) : string
    {
		const regexp = new RegExp(/(?:[^a-zA-Z0-9-_]*)/g);
        return name.replaceAll(regexp, '');
    }
}
