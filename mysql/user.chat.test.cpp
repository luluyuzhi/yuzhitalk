#include <vector>
#include <string>
#include <stdlib.h>
#include <time.h>
#include <stdio.h>
#include <iostream>
using namespace std;
int main()
{
    // 产生一万条随机的时间数据
    std::string time1 = "2017-01-01 00:00:00";
    std::string time2 = "2017-01-";
    std::string time3 = " 00:00:00";
    srand(time(0));
    for (int i = 0; i < 100000; ++i)
    {
        int t = rand() % 31;
        std::cout <<"," << 1 << "," << 10000 << "," << time2 + std::to_string(t) + time3 << std::endl;
        std::cout << 10000 << "," << 1 << "," << time2 + std::to_string(t)  + time3 << std::endl;
        int t2 = rand() % 31;
        for (int i = 0; i < t2; ++i)
        {
            time1[6] = rand() % 9 + '1';
            std::cout << "," << rand() % 100000 << "," << rand() % 100000 << "," << time1 << std::endl;
        }
    }
    return 0;
}
// 
// -- 生成最近一周的时间戳
// -- 45229 rows in set (0.82 sec)