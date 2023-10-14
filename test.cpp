#include <iostream>

# define AVERAGE_GAIN   30
# define STEP           5

int moderate_increase(int gain, int count)
{
    if (gain < AVERAGE_GAIN * 2)
        return (0);
    if (gain >= AVERAGE_GAIN * 4)
        return (1);
    if (gain < AVERAGE_GAIN * 2 && count >=  (AVERAGE_GAIN * 0.25) - 1)
        return (0);
    if (gain < AVERAGE_GAIN * 2.50 && count >=  AVERAGE_GAIN * 0.25)
        return (0);
    if (gain < AVERAGE_GAIN * 3 && count >= AVERAGE_GAIN * 0.33)
        return (0);
    if (gain < AVERAGE_GAIN * 3.50 && count >= AVERAGE_GAIN * 0.5)
        return (0);
    if (gain <  AVERAGE_GAIN * 4 && count >= AVERAGE_GAIN * 0.66)
        return (0);
    return (1); 
}


int moderate_decrease(int gain, int count)
{
    if (gain == 1)
        return (1);
    if (gain > AVERAGE_GAIN * 0.80)
        return (0);
    if (gain >  AVERAGE_GAIN * 0.50 && count >=  AVERAGE_GAIN * 0.25)
        return (0);
    if (gain >  AVERAGE_GAIN * 0.25 && count >=  AVERAGE_GAIN * 0.33)
        return (0);
    if (gain <  AVERAGE_GAIN * 0.25 && count >= AVERAGE_GAIN)
        return (0);
    return (1);
}

int decrease_gain(int player_1, int player_2, int gain)
{
    int count = 0;
    while (player_1 > player_2)
    {
        player_1 -= STEP;
        count++;
        if (moderate_decrease(gain, count) == 0)
        {
            gain -= 1;
            count = 0;
        }
    }   
    return (gain);
}

int increase_gain(int player_1, int player_2, int gain)
{
    int count = 0;
    while (player_1 < player_2)
    {
        player_1 += STEP;
        count++;
        if (moderate_increase(gain, count) == 0)
        {
            gain += 1;
            count = 0;
        }
    }
    return (gain);
}


int get_gain(int player_1, int player_2)
{
    int gain = AVERAGE_GAIN;
    int add = 1;
    if (player_1 > player_2)
        gain = decrease_gain(player_1, player_2, gain);
    else if (player_1 < player_2)
        gain = increase_gain(player_1, player_2, gain);
    return (gain);
}

int main(void)
{
    int player_1 = 800;
    int player_2 = 800;
 
    for (int i = 0; i < 20; i++)
    {
        player_2 += (i * 10);
        int gain_1 = get_gain(player_1, player_2);
        int gain_2 = get_gain(player_2, player_1);
        std::cout << "player 1: " << player_1 << " player 2: " << player_2 << "\n"; 
        std::cout << "gain 1: " << gain_1 << "\ngain 2: " << gain_2 << "\n"; 
    }
}