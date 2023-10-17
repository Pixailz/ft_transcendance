export class ReplaceNickname {

    replace_nickname(name: string)
    {
        const	accept_char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789"
        let		new_name = '';
        for (let i = 0; i < name.length; i++)
        {
            for (let j = 0; j < accept_char.length; j++)
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
