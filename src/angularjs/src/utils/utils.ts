export class ReplaceNickname {
    replace_nickname(name: string) : string
    {
        const	accept_char: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789"
        let		new_name: string = '';
        if (!name)
            return (name);
        for (let i: number = 0; i < name.length; i++)
        {
            for (let j:number = 0; j < accept_char.length; j++)
            {
                if (accept_char[j] === name[i])
                {
                    new_name += name[i];
                    break;
                }
            }
        }
        return (new_name);
    }
}
