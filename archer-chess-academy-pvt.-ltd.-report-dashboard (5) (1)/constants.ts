import { Grade } from './types';

export const LOGO_ARCHER = 'https://ik.imagekit.io/5l2evgjsq/Archer%20Kids%20Final%20Logo-01.png';
export const LOGO_ISO = 'https://ik.imagekit.io/5l2evgjsq/iso%20png.png';
export const LOGO_FIDE = 'https://ik.imagekit.io/5l2evgjsq/fide.png';

export const GRADE_SCORES: Record<Grade, number> = {
  [Grade.APlus]: 100,
  [Grade.A]: 90,
  [Grade.B]: 75,
  [Grade.C]: 60,
  [Grade.D]: 40,
  [Grade.E]: 20,
};

export const SKILL_LIST = [
  'Tactics',
  'Logical Thinking',
  'Creativity',
  'Patience',
  'Focus',
  'Positional Play',
  'Opening',
  'Middle Game',
  'Endgame',
];

export const MAX_SCORE = 900;
export const VERDICT_THRESHOLD_READY = 750;
export const VERDICT_THRESHOLD_ALMOST = 600;

export const MAX_REVIEW_CHARS = 3000;

export const RAW_CSV_DATA = `Serial No.,Coach Name,Batch Time (Days/Time),Level
1,Sahil Bhoyar,TF 5 PM IST,Intermediate
2,Sarang,TTH 4 PM IST,Intermediate
3,Gaurav Arora,TTH 5 PM IST,Beginner
4,Dilip,MT 8 PM IST,Intermediate
5,Sahil Bhoyar,WF 1 PM IST,Beginner
6,Dilip,Monday 1 PM IST,Beginner
7,Sahil Bhoyar,TF 6 PM IST,Intermediate
8,Sahil Bhoyar,MW 7 PM IST,AL-2
9,Sahil Bhoyar,MTH 8 PM IST,Beginner
10,Sarvesh,TW 4 PM IST,Intermediate
11,Sahil Bhoyar,MTH 3 PM IST,AL-1
12,Sarang,MF 5 PM IST,Beginner
13,Sunayana,TS 5 PM IST,Intermediate
14,Aayush,FS 8 PM IST,Intermediate
15,Kavita Sharma,MF 11 AM IST,Beginner
16,Kavita Sharma,THF 12 PM IST,Beginner
17,Chandresh,WS 6 PM IST,Beginner
18,Abhishek,TTH 7 PM IST,Intermediate
19,Ambarish,MTH 7 PM IST,AL-2
20,Sarvesh,MT 5 PM IST,Intermediate
21,Sunayana,MTH 6 PM IST,AL-1
22,FM Kumar Gaurav,TTH 8 PM IST,Expert-1 (Module-1)
23,Abhishek,WF 2 PM IST,AL-1
24,Abhishek,TTH 6 PM IST,Beginner
25,Kavita Sharma,WF 1 PM IST,Beginner
26,Gaurav Arora,FS 5 PM IST,Intermediate
27,Ayush Nath,FS 7 PM IST,Intermediate
28,Kavita Sharma,MT 1 PM IST,Beginner
29,Gaurav Arora,TF 7 PM IST,Intermediate
30,Aayush,MTH 8 PM IST,AL-1
31,Sarang,TTH 5 PM IST,AL-1
32,Dilip,FS 5 PM IST,Intermediate
33,Kavita Sharma,MTH 2 PM IST,Beginner
34,Sarvesh,TW 9 PM IST,Intermediate
35,Dilip,MW 5 PM IST,Beginner
36,Aayush,TW 8 PM IST,Intermediate
37,Kavita Sharma,TF 2 PM IST,Intermediate
38,Ayush Nath,TTH 5 PM IST,AL-1
39,Chandresh,TTH 7 PM IST,Intermediate
40,Kavita Sharma,MW 3 PM IST,Intermediate
41,Ayush Nath,FS 4 PM IST,Intermediate
42,Ayush Nath,TF 8 PM IST,Intermediate
43,Sarvesh,MTH 8 PM IST,AL-1
44,Gaurav Arora,MW 6 PM IST,Beginner
45,Kavita Sharma,FS 3 PM IST,Beginner
46,Sahil Bhoyar,WS 5 PM IST,Beginner
47,FM Kumar Gaurav,TTH 6 PM IST,Expert-1 (Module-1)
48,Ayush Nath,MTH 8 PM IST,Intermediate
49,Gaurav Arora,TTH 6 PM IST,Intermediate
50,Sunayana,MTH 7 PM IST,AL-1
51,Dilip,WS 8 PM IST,AL-2
52,Dilip,WS 7 PM IST,Intermediate
53,Sarvesh,TF 3 PM IST,Beginner
54,Sahil Bhoyar,TW 8 PM IST,Intermediate
55,Sunayana,WS 7 PM IST,Intermediate
56,Ayush Nath,MW 5 PM IST,Intermediate
57,Aayush,MTH 7 PM IST,Intermediate
58,Sarvesh,TTH 6 PM IST,Intermediate
59,Sahil Bhoyar,TF 7 PM IST,Intermediate
60,Sahil Bhoyar,MS 6 PM IST,Beginner
61,Sahil Bhoyar,TF 3 PM IST,Beginner
62,Abhishek,TTH 1 PM IST,AL-1
63,Ambarish,MTH 8 PM IST,Expert-1 (Module-3)
64,Sunayana,FS 6 PM IST,Intermediate
65,Abhishek,MTH 2 PM IST,AL-1
66,Sarang,FS 7 PM IST,Beginner
67,Sarang,FS 8 PM IST,AL-1
68,Sunayana,MW 8 PM IST,Beginner
69,Abhishek,TW 3 PM IST,AL-2
70,Sarang,MW 6 PM IST,Intermediate
71,Sunayana,TF 7 PM IST,Intermediate
72,Aayush,TF 7 PM IST,Intermediate
73,Sarang,WS 5 PM IST,AL-1
74,Sarvesh,FS 7 PM IST,Intermediate
75,Sarang,MTH 8 PM IST,AL-1
76,Chandresh,FS 4 PM IST,Intermediate
77,Abhishek,THF 3 PM IST,Intermediate
78,Sarvesh,TW 8 PM IST,Intermediate
79,Sarvesh,TW 7 PM IST,Intermediate
80,Aayush,TTH 6 PM IST,Intermediate
81,Chandresh,MTH 8 PM IST,Intermediate
82,Dilip,MTH 7 PM IST,AL-1
83,Dilip,MW 2 PM IST,Intermediate
84,Sarang,TW 8 PM IST,Intermediate
85,Sarang,TTH 6 PM IST,Beginner
86,Aayush,WF 6 PM IST,Beginner
87,Sarang,MF 4 PM IST,Intermediate
88,Chandresh,FS 7 PM IST,Intermediate
89,Sarvesh,WF 5 PM IST,Intermediate
90,Chandresh,TF 6 PM IST,Intermediate
91,Dilip,TF 6 PM IST,AL-1
92,Sarvesh,FS 8 PM IST,Intermediate
93,Ayush Nath,MW 7 PM IST,Intermediate
94,Sunayana,MF 5 PM IST,Intermediate
95,Sunayana,FS 4 PM IST,Beginner
96,Dilip,TTH 2 PM IST,Intermediate
97,Sarang,MW 7 PM IST,Intermediate
98,Chandresh,WF 5 PM IST,Intermediate
99,Dilip,MW 3 PM IST,Intermediate
100,WGM Harshita Guddanti,General Batch,Beginner
101,Pranab Maity,General Batch,Beginner
102,Megha Chakraborty,General Batch,Beginner
103,Maheswar Nayak,General Batch,Beginner
104,Shekhar Raha,General Batch,Beginner
105,Piyush Bohra,General Batch,Beginner
106,Ram Mohan Soni,General Batch,Beginner
107,Nayan Ramteke,General Batch,Beginner
108,Ashkar MM,General Batch,Beginner
109,Raghvendra Kumar,General Batch,Beginner
110,Akkula Mahesh,General Batch,Beginner
111,Mohanraj S,General Batch,Beginner
112,Shubh Saxena,General Batch,Beginner
113,Yogesh Waran,General Batch,Beginner
114,Navya,General Batch,Beginner
115,Baidurya Mitra,General Batch,Beginner
116,Satyam Nayak,General Batch,Beginner
117,Pratyush,General Batch,Beginner
118,Toyesh Singh,General Batch,Beginner
119,Abhijeet Sharma,General Batch,Beginner
120,Mihir Vaid,General Batch,Beginner
121,Desmond Toppo,General Batch,Beginner`
;

export const LEVELS = [
  'Beginner',
  'Intermediate',
  'AL-1',
  'AL-2',
  'AL-3',
  'Expert',
  'Expert-1 (Module-1)',
  'Expert-1 (Module-3)'
];