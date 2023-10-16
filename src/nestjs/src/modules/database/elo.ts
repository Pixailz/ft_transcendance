export class Elo {

    average_gain: number = 30;
    step: number = 5;

    moderate_increase(gain: number, count: number)
    {
        if (gain < this.average_gain * 2)
            return (0);
        if (gain >= this.average_gain * 4)
            return (1);
        if (gain < this.average_gain * 2 && count >=  (this.average_gain * 0.25) - 1)
            return (0);
        if (gain < this.average_gain * 2.50 && count >=  this.average_gain * 0.25)
            return (0);
        if (gain < this.average_gain * 3 && count >= this.average_gain * 0.33)
            return (0);
        if (gain < this.average_gain * 3.50 && count >= this.average_gain * 0.5)
            return (0);
        if (gain <  this.average_gain * 4 && count >= this.average_gain * 0.66)
            return (0);
        return (1); 
    }


    moderate_decrease(gain: number, count: number)
    {
        if (gain == 1)
            return (1);
        if (gain > this.average_gain * 0.80)
            return (0);
        if (gain >  this.average_gain * 0.50 && count >=  this.average_gain * 0.25)
            return (0);
        if (gain >  this.average_gain * 0.25 && count >=  this.average_gain * 0.33)
            return (0);
        if (gain <  this.average_gain * 0.25 && count >= this.average_gain)
            return (0);
        return (1);
    }

    decrease_gain(player_1: number, player_2: number, gain: number)
    {
        let count = 0;
        while (player_1 > player_2)
        {
            player_1 -= this.step;
            count++;
            if (this.moderate_decrease(gain, count) == 0)
            {
                gain -= 1;
                count = 0;
            }
        }   
        return (gain);
    }

    increase_gain(player_1: number, player_2: number, gain: number)
    {
        let count = 0;
        while (player_1 < player_2)
        {
            player_1 += this.step;
            count++;
            if (this.moderate_increase(gain, count) == 0)
            {
                gain += 1;
                count = 0;
            }
        }
        return (gain);
    }

    get_gain(player_1: number, player_2: number)
    {
        let gain = this.average_gain;
        if (player_1 > player_2)
            gain = this.decrease_gain(player_1, player_2, gain);
        else if (player_1 < player_2)
            gain = this.increase_gain(player_1, player_2, gain);
        return (gain);
    }
}
