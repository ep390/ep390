import styles from "@/app/[...markdown]/markdown.module.css";
import { AbcPlayer, Abc, AbcMidiLink } from "@/components/abc";
import Toggle from "@/components/Toggle";

//import abcScore1 from './score1'
const abcScore1 = `X:1
%%score { 1 | 2 }
L:1/8
Q:1/4=92
M:3/4
K:F
V:1 treble nm="Piano" snm="Pno."
V:3 treble 
V:2 bass
V:4 bass
[V:1]"^Andante"!p! z6|[V:2]!ped! z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]x6|
[V:1]z6|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]x6|
[V:1](!trill(!Ta6-|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]x6|
[V:1]!trill)!a2!<(! !tenuto!^g!tenuto!a!<)!!>(!{/c'} (ba)!>)!|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]{/a} (!tenuto!f'4 e'2-)|[V:2]!ped! z2 !arpeggio![D,B,G]2 !arpeggio![G,,D,B,]2|[V:3]x6|[V:4]x6|
[V:1]e'!<(!(d'e'd'c'b)!<)!|[V:2]z2 !arpeggio![D,B,G]2 !arpeggio![G,,D,B,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!>(!{/a} (!tenuto!a'4 ^g'2-)!>)!|[V:2]!ped! z2 !arpeggio![D,B,E]2 !arpeggio![^G,,D,=B,]2|[V:3]x6|[V:4]x6|
[V:1]!<(! g'(^ga=b^c'd')!<)!|[V:2]z2 !arpeggio![D,=B,E]2 !arpeggio![^G,,D,B,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!mp!!>(!{/f} (!tenuto!d'4 ^c'2-)|[V:2]!ped! z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,^C]2|[V:3]x6|[V:4]x6|
[V:1]c'!>)!!<(!(^cdefg)!<)!|[V:2]z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,^C]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/A} (!tenuto!g4 f2-)|[V:2]!ped! z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]x6|
[V:1]f!>)!!<(!(efg!<)!!>(!fd)!>)!|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!pp! (!tenuto!A4 ^G2-)|[V:2]!ped! z2 !arpeggio![F,,=B,,D,A,]2 !arpeggio![F,,B,,D,^G,]2|[V:3]x6|[V:4]x6|
[V:1]!<(! G(^GA=B^cd)!<)!|[V:2]z2 !arpeggio![F,,=B,,D,A,]2 !arpeggio![F,,B,,D,^G,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/F} (!tenuto!d4 ^c2-)|[V:2]!ped! z2 !arpeggio![G,,E,B,]2 !arpeggio![B,,E,^C]2|[V:3]x6|[V:4]x6|
[V:1]c!>)!!<(!(^CDEFG)!<)!|[V:2]z2 !arpeggio![G,,E,B,]2 !arpeggio![B,,E,^C]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/A,} (!tenuto!G4 F2-)|[V:2]!ped! z2 !arpeggio![A,,F,D]2 !arpeggio![F,,D,A,]2|[V:3]x6|[V:4]x6|
[V:1]F!>)!!<(!(EFG!<)!!>(!FD)!>)!|[V:2]z2 !arpeggio![A,,F,D]2 !arpeggio![F,,D,A,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1][K:bass]!pp! (!tenuto!A,4 ^G,2-)|[V:2]!ped! z2 !arpeggio![F,,=B,,D,]2 !arpeggio![F,,B,,D,]2|[V:3][K:bass] x6|[V:4]x6|
[V:1]!<(! G,(^G,A,=B,^CD)!<)!|[V:2]z2 !arpeggio![F,,=B,,D,]2 !arpeggio![F,,B,,D,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!pp!!>(!{/F,} (!tenuto!D4 ^C2-)|[V:2]!ped! z2 !arpeggio![G,,B,,E,]2 !arpeggio![G,,B,,E,]2|[V:3]x6|[V:4]x6|
[V:1]C2 !tenuto!^C2 !tenuto!C2!>)!||[V:2]z2 !arpeggio![G,,B,,E,]2 !arpeggio![G,,B,,E,]2!ped-up!||[V:3]x6||[V:4]x6||
[V:1][K:D][K:treble][Q:1/4=144]"^Piu mosso"!p! (!>!D/E/F/G/) (!>!A/B/c/d/) (!>!e/f/g/a/)|[V:2][K:D]!ped! z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2!ped-up!|[V:3][K:D][K:treble] x6|[V:4][K:D] !>!D,,,6|
[V:1](!>!b/c'/d'/e'/) (!>!f'/e'/d'/c'/) (!>!b/a/g/f/)|[V:2]!ped! z2 !arpeggio![D,B,F]2 !arpeggio![A,,F,B,]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1](!>!e/f/g/a/) (!>!b/c'/d'/e'/) (!>!f'/g'/a'/b'/)|[V:2]!ped! z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,D]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1]!8va(! (!>!c''/d''/e''/f''/) (!>!g''/f''/e''/d''/) (!>!c''/b'/a'/g'/)|[V:2]!ped! z2 !arpeggio![E,CG]2 !arpeggio![A,,G,C]2!ped-up!|[V:3]!8va(! x6|[V:4]!>!D,,,6|
[V:1](!>!f'/g'/a'/b'/) 
    (!>!c''/d''/e''/f''/) (!>!g''/f''/e''/d''/)|[V:2]!ped! z2 !arpeggio![F,DA]2 !arpeggio![A,,F,D]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1](!>!c''/b'/a'/g'/) (!>!f'/e'/d'/c'/) (!>!b/a/g/f/)|[V:2]!ped! z2 !arpeggio![D,B,F]2 !arpeggio![A,,F,B,]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1](!>!e/f/g/a/) (!>!b/c'/d'/e'/) (!>!f'/g'/a'/b'/)|[V:2]!ped! z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,D]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1]!<(! (!>!c''/d''/e''/f''/) (!>!g''/f''/e''/d''/) (!>!c''/b'/a'/g'/)!<)!|[V:2]!ped! z2 !arpeggio![E,CG]2 !arpeggio![A,,G,C]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1]!mf! (!>!f'/g'/a'/b'/) 
    (!>!c''/d''/e''/f''/) (!>!g''/f''/e''/d''/)|[V:2]!ped! z2 !arpeggio![F,DA]2 !arpeggio![A,,F,D]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1](!>!c''/b'/a'/g'/) (!>!f'/e'/d'/c'/) (!>!b/a/g/f/)|[V:2]!ped! z2 !arpeggio![D,B,F]2 !arpeggio![A,,F,B,]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1]"_dim." (!>!e/f/g/a/) (!>!b/c'/d'/e'/) (!>!f'/g'/a'/b'/)|[V:2]!ped! z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,D]2!ped-up!|[V:3]x6|[V:4]!>!D,,,6|
[V:1](!>!c''/d''/e''/f''/) (!>!g''/f''/e''/d''/) (!>!c''/b'/a'/g'/)!8va)!||[V:2]!ped! z2 !arpeggio![E,CG]2 !arpeggio![A,,G,C]2!ped-up!||[V:3]x6!8va)!||[V:4]!>!D,,,6||
[V:1][K:F]!p![Q:1/4=92]"^Andante" (!tenuto!f'4 e'2-)|[V:2][K:F]!ped! z2 !arpeggio![D,B,F]2 !arpeggio![G,,D,B,]2|[V:3][K:F] x6|[V:4][K:F] !>!G,,,,6|
[V:1]e'!<(!(d'e'd'c'b)!<)!|[V:2]z2 !arpeggio![D,B,F]2 !arpeggio![G,,D,B,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!>(!{/a} (!tenuto!a'4 ^g'2-)|[V:2]!ped! z2 !arpeggio![D,B,E]2 !arpeggio![^G,,D,=B,]2|[V:3]x6|[V:4]!>!G,,,,6|
[V:1]g'!>)!!<(!(^ga=b^c'd')!<)!|[V:2]z2 !arpeggio![D,=B,E]2 !arpeggio![^G,,D,B,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!mp!!>(!{/f} (!tenuto!d'4 ^c'2-)|[V:2]!ped! z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,^C]2|[V:3]x6|[V:4]!>!G,,,,6|
[V:1]c'!>)!!<(!(^cdefg)!<)!|[V:2]z2 !arpeggio![E,B,G]2 !arpeggio![B,,G,^C]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/A} (!tenuto!g4 f2-)|[V:2]!ped! z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]!>!D,,,6|
[V:1]f!>)!!<(!(efg!<)!!>(!fd)!>)!|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!pp! (!tenuto!A4 ^G2-)|[V:2]!ped! z2 !arpeggio![F,,=B,,D,A,]2 !arpeggio![F,,B,,D,^G,]2|[V:3]x6|[V:4]!>!F,,,,6|
[V:1]!<(! G(^GA=B^cd)!<)!|[V:2]z2 !arpeggio![F,,=B,,D,A,]2 !arpeggio![F,,B,,D,^G,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/F} (!tenuto!d4 ^c2-)|[V:2]!ped! z2 !arpeggio![G,,E,B,]2 !arpeggio![B,,E,^C]2|[V:3]x6|[V:4]!>!G,,,,6|
[V:1]c!>)!!<(!(^CDEFG)!<)!|[V:2]z2 !arpeggio![G,,E,B,]2 !arpeggio![B,,E,^C]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!p!!>(!{/A,} (!tenuto!G4 F2-)|[V:2]!ped! z2 !arpeggio![A,,F,D]2 !arpeggio![F,,D,A,]2|[V:3]x6|[V:4]!>!D,,,,6|
[V:1]F!>)!!<(!(EFG!<)!!>(!FD)!>)!|[V:2]z2 !arpeggio![A,,F,D]2 !arpeggio![F,,D,A,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1][K:bass]!pp! (!tenuto!A,4 ^G,2-)|[V:2]!ped! z2 !arpeggio![F,,=B,,D,]2 !arpeggio![F,,B,,D,]2|[V:3][K:bass] x6|[V:4]!>!F,,,,6|
[V:1]!<(! G,(^G,A,=B,^CD)!<)!|[V:2]z2 !arpeggio![F,,=B,,D,]2 !arpeggio![F,,B,,D,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1]!pp!!>(!{/F,} (!tenuto!D4 ^C2-)|[V:2]!ped! z2 !arpeggio![G,,B,,E,]2 !arpeggio![G,,B,,E,]2|[V:3]x6|[V:4]!>!G,,,,6|
[V:1]C2 !tenuto!^C2 !tenuto!C2!>)!|[V:2]z2 !arpeggio![G,,B,,E,]2 !arpeggio![G,,B,,E,]2!ped-up!|[V:3]x6|[V:4]x6|
[V:1][K:treble]!pp![Q:1/4=92]"^Andante"!<(! z2!8va(! !tenuto![af'a']2 !tenuto![af'a']2|[V:2]!ped! z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3][K:treble] x2!8va(! x4|[V:4]!>!D,,,,6|
[V:1]!tenuto![af'a']2!<)!!>(! (!tenuto![af'a']2 !tenuto![af'a']2)!>)!|[V:2]z2 !arpeggio![D,A,F]2 !arpeggio![A,,F,D]2|[V:3]x6|[V:4]x6|
[V:1]!ppp! !tenuto![af'a']6-|[V:2][D,,,D,,]6-|[V:3]x6|[V:4]x6|
[V:1][af'a']2!8va)! z2 z2|][V:2][D,,,D,,]2!ped-up! z2 z2|][V:3]x2!8va)! x4|][V:4]x6|]`;


const abcScore2 = `X:1
%%score { ( 1 2 ) | ( 3 4 ) }
L:1/8
Q:1/4=84
M:6/8
K:D
V:1 treble nm="Piano" snm="Pno."
V:2 treble
V:3 bass
V:4 bass
[V:1]"^Andante con moto"!p! z ([A,FA][A,FA] [A,FA][A,FA][A,^EA]|[V:2]x2 A, ^A,B,^B,|[V:3]{/D,,} !>![D,,,D,,]6-|[V:4]x6|
[V:1][A,FA][A,FA][A,FA] [A,FA][A,FA][A,^EA])|[V:2]CDC =CB,_B,|[V:3][D,,,D,,]6|[V:4]x6|
[V:1]z ([A,FA][A,FA] [A,FA][A,FA][A,^EA]|[V:2]x2 A, ^A,B,^B,|[V:3]{/D,,} !>![D,,,D,,]6-|[V:4]x6|
[V:1][A,FA][A,FA][A,FA] [A,FA][A,FA][A,^EA])||[V:2]CDC =CB,_B,||[V:3][D,,,D,,]6||[V:4]x6||
[V:1]!p! (A2 B cd>c|[V:2]z [A,F][B,F] [CF][DF][CF]|[V:3]{/D,,} [D,,,D,,] ([A,,F,][A,,F,] [A,,F,][A,,F,][A,,F,]|[V:4]x6|
[V:1]c3 B3)|[V:2][CF][CF][CF] [B,F][B,F][B,F]|[V:3][A,,F,][A,,F,][A,,F,] [A,,F,][A,,F,][A,,F,])|[V:4]x6|
[V:1](F2 G AB>F|[V:2]z [F,D][G,D] [A,D][B,D]>[F,D]|[V:3]{/D,,} [D,,,D,,] ([A,,D,][A,,D,] [A,,D,][A,,D,][A,,D,]|[V:4]x6|
[V:1]F3 E3)|[V:2][F,D][F,D][F,D] [E,D][E,D][E,D]|[V:3][A,,D,][A,,D,][A,,D,] [A,,D,][A,,D,][A,,D,])|[V:4]x6|
[V:1](E2 F!<(! GA>B|[V:2]z [E,D][F,D] [G,D][A,D]>[B,D]|[V:3]{/D,,} [D,,,D,,] ([G,,D,][G,,D,] [G,,D,][G,,D,][G,,D,]|[V:4]x6|
[V:1]B3 c3)!<)!|[V:2][B,D][B,D][B,D] [CG][CG][CG]|[V:3][G,,D,][G,,D,][G,,D,] [E,,A,,E,])[A,,E,][A,,E,]|[V:4]x6|
[V:1]!mf! (f2 e!>(! dc>B|[V:2]z [Fd][EF] [DF][CF]>[B,F]|[V:3]{/D,,} [D,,,D,,] ([F,^A,E][F,A,E] [F,A,E][F,A,E][F,A,E]|[V:4]x6|
[V:1]B3!>)!!p! A3)|[V:2][B,F][B,F][B,F] [A,G][A,G][A,G]|[V:3][F,^A,E][F,A,E][F,A,E] [A,,E,=A,])[E,A,][E,A,]|[V:4]x6|
[V:1]!p! (A2 B cd>c|[V:2]z [A,F][B,F] [CF][DF][CF]|[V:3]{/D,,} [D,,,D,,] ([A,,F,][A,,F,] [A,,F,][A,,F,][A,,F,]|[V:4]x6|
[V:1]c3 B3)|[V:2][CF][CF][CF] [B,F][B,F][B,F]|[V:3][A,,F,][A,,F,][A,,F,] [A,,F,][A,,F,][A,,F,])|[V:4]x6|
[V:1](F2 G AB>F|[V:2]z [F,D][G,D] [A,D][B,D]>[F,D]|[V:3]{/D,,} [D,,,D,,] ([A,,D,][A,,D,] [A,,D,][A,,D,][A,,D,]|[V:4]x6|
[V:1]F3 E3)|[V:2][F,D][F,D][F,D] [E,D][E,D][E,D]|[V:3][A,,D,][A,,D,][A,,D,] [A,,D,][A,,D,][A,,D,])|[V:4]x6|
[V:1](E2 F!<(! GA>B|[V:2]z [E,D][F,D] [G,D][A,D]>[B,D]|[V:3]{/D,,} [D,,,D,,] ([G,,D,][G,,D,] [G,,D,][G,,D,][G,,D,]|[V:4]x6|
[V:1]B3!<)!!mf! f2 e)|[V:2][B,D][B,D][B,D] [FB][FB][EB]|[V:3][G,,D,][G,,D,][G,,D,] [G,,D,B,])[D,B,][D,B,]|[V:4]x6|
[V:1]!>(! (d2 c B^A>c|[V:2]z [DG][CG] [B,G][^A,G]>[CG]|[V:3]{/[A,,,A,,]} [A,,,A,,] ([E,A,][E,A,] [E,A,][E,A,][E,A,]|[V:4]x6|
[V:1]c3!>)!!p! B3)|[V:2][CG][CG][CG] [B,F][B,F][B,F]|[V:3][E,A,][E,A,][E,A,] [B,,F,])[B,,F,][B,,F,]|[V:4]x6|
[V:1]!pp! (B2 c de>B|[V:2]z [B,G][CG] [DG][EG]>[B,G]|[V:3]{/[G,,,G,,]} [G,,,G,,] ([D,G,][D,G,] [D,G,][D,G,][D,G,]|[V:4]x6|
[V:1]B3 A3)|[V:2][B,G][B,G][B,G] [A,G][A,G][A,G]|[V:3][D,G,][D,G,][D,G,] [C,G,][C,G,][C,G,])|[V:4]x6|
[V:1]"_cresc." (=c2 d _e=f>c|[V:2]z [=C_A][DA] [_EA][=FA]>[CA]|[V:3]{/[_A,,,_A,,]} [A,,,A,,] ([_E,_A,][E,A,] [E,A,][E,A,][E,A,]|[V:4]x6|
[V:1]=c3 _B3)|[V:2][=C_A][CA][CA] [_B,A][B,A][B,A]|[V:3][_E,_A,][E,A,][E,A,] [D,A,][D,A,][D,A,])|[V:4]x6|
[V:1]!f! ([G_eg]2 [=F=f] [EGe][DGd]>[=CG=c]|[V:2]x6|[V:3]{/[_E,,,_E,,]} [E,,,E,,] ([_B,,G,_B,][B,,G,B,] [B,,G,B,][B,,G,B,][B,,G,B,]|[V:4]x6|
[V:1][=CG=c]3 [_B,G_B]3)|[V:2]x6|[V:3][_B,,G,_B,][B,,G,B,][B,,G,B,] [B,,G,][B,,G,][B,,G,])|[V:4]x6|
[V:1]!>(! ([G_eg]2 [=Fe=f] [_EGe][DGd]>[=CG=c]|[V:2]x6|[V:3]{/[_E,,,_E,,]} [E,,,E,,] ([_B,,G,_B,][B,,G,B,] [B,,G,B,][B,,G,B,][B,,G,B,]|[V:4]x6|
[V:1][=CG=c]3!>)!!p! [_B,G_B]3)|[V:2]x6|[V:3][_B,,G,_B,][B,,G,B,][B,,G,B,] [B,,G,][B,,G,][B,,G,])|[V:4]x6|
[V:1]"_cresc." ([_B,G_B]3 [=B,G=B]3|[V:2]x6|[V:3][_E,,_B,,G,][E,,B,,G,][E,,B,,G,] [D,,B,,G,][D,,B,,G,][D,,B,,G,]|[V:4]x6|
[V:1]!>![=CG=c]3 !>![^CG^c]3|[V:2]x6|[V:3][_E,,=C,G,][E,,C,G,][E,,C,G,] [_E,,C,G,][E,,C,G,][E,,C,G,]|[V:4]x6|
[V:1]!ff! !>![DGd]2 [Ee] [Ff][Gg]>[B,B]|[V:2]x6|[V:3][D,,B,,G,][D,G,B,][D,G,B,] [D,G,B,][D,G,B,][D,G,]|[V:4]x6|
[V:1]!>(! [B,B]3 [A,A]3)!>)!|[V:2]x6|[V:3][A,,,A,,][A,,D,G,][A,,D,G,] [A,,C,G,][A,,C,G,][A,,C,G,]|[V:4]x6|
[V:1]!p! ([A,=FA]2 [B,B] [=C=c][Dd]>[A,A]|[V:2]x6|[V:3][D,,,D,,] [A,,D,=F,][A,,D,F,] [A,,D,F,][A,,D,F,][A,,D,F,]|[V:4]x6|
[V:1][A,A]3 [^G,^G]3)|[V:2]x6|[V:3][B,,,B,,][B,,D,=F,][B,,D,F,] [B,,D,F,][B,,D,F,][B,,D,F,]|[V:4]x6|
[V:1]"_cresc." ([_B,G_B]2 [=C=c] [Dd][_E_e]>[B,B]|[V:2]x6|[V:3][_E,,,_E,,] [_B,,_E,G,][B,,E,G,] [B,,E,G,][B,,E,G,][B,,E,G,]|[V:4]x6|
[V:1][_B,_B]3 [A,A]3)|[V:2]x6|[V:3][=C,,=C,][C,_E,G,][C,E,G,] [C,E,G,][C,E,G,][C,E,G,]|[V:4]x6|
[V:1]([=C_A=c]2 [Dd] [_E_e][=F=f]>[Cc]|[V:2]x6|[V:3][=F,,,=F,,] [=C,=F,_A,][C,F,A,] [C,F,A,][C,F,A,][C,F,A,]|[V:4]x6|
[V:1][=C=c]3 [B,B]3)|[V:2]x6|[V:3][D,,D,][D,=F,_A,][D,F,A,] [D,F,A,][D,F,A,][D,F,A,]|[V:4]x6|
[V:1]!ff! ([D_Bd]2 [_E_e] [=F=f][_G_g]>[_D_d]|[V:2]x6|[V:3][_G,,,_G,,] [_D,_G,_B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1][_D_d]3 [=C=c]3)|[V:2]x6|[V:3][_E,,_E,][E,_G,__B,][E,G,B,] [E,G,B,][E,G,B,][E,G,B,]|[V:4]x6|
[V:1]!fff! ([_F_d_f]2 [_G_g] [_A_a][__B__b]>[_F__f]|[V:2]x6|[V:3][__B,,,__B,,] [_F,__B,__D][F,B,D] [F,B,D][F,B,D][F,B,D]|[V:4]x6|
[V:1][_F_f]3 [_E_e]3)|[V:2]x6|[V:3][__G,,__G,__B,__D][G,B,D][G,B,D] [G,B,D][G,B,D][G,B,D]|[V:4]x6|
[V:1]([_Ec_e]2 [_F_f] [_G_g][__A__a]>[E__e]|[V:2]x6|[V:3][__A,,,__A,,] [__E,__A,_C][E,A,C] [E,A,C][E,A,C][E,A,C]|[V:4]x6|
[V:1][__E__e]3 [_D__d]3)|[V:2]x6|[V:3][_F,,_F,][F,__A,_C][F,A,C] [F,A,C][F,A,C][F,A,C]|[V:4]x6|
[V:1]!fff! ([_D_B_d]2 [_E_e] [_F_f][_G_g]>[__D__B__d]|[V:2]x6|[V:3][__G,,,__G,,] [__D,__G,__B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1][_D__B_d]3 [_C__A_c]3)|[V:2]x6|[V:3][__E,,__E,][E,__G,__B,][E,G,B,] [E,G,B,][E,G,B,][E,G,B,]|[V:4]x6|
[V:1]"_dim." ([_C_A_c]3 [_B,_G_B]3)|[V:2]x6|[V:3][__G,,,__G,,][__D,__G,__B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1]([__B,_G__B]3 [_A,_F_A]3)|[V:2]x6|[V:3][__D,,__D,][D,__F,__A,][D,F,A,] [D,F,A,][D,F,A,][D,F,A,]|[V:4]x6|
[V:1]!p! ([__B,__G__B]3 [_A,_F_A]3)|[V:2]x6|[V:3][__G,,,__G,,][__D,__G,__B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1]([__B,__G__B]3 [_A,_F_A]3)|[V:2]x6|[V:3][__D,,__D,][D,_F,__A,][D,F,A,] [D,F,A,][D,F,A,][D,F,A,]|[V:4]x6|
[V:1][__B,__G__B]6|[V:2]x6|[V:3][__G,,,__G,,][__D,__G,__B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1][__B,__G__B]6|[V:2]x6|[V:3][__D,__G,__B,][D,G,B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1][__B,__G__B]6|[V:2]x6|[V:3][__D,__G,__B,][D,G,B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1][__B,__G__B]3 [B,GB]3|[V:2]x6|[V:3][__D,__G,__B,][D,G,B,][D,G,B,] [D,G,B,][D,G,B,][D,G,B,]|[V:4]x6|
[V:1]!ppp! !arpeggio![__B,__G__B__d__g__b__d'__g'__b']6|[V:2]x6|[V:3]!ped!{/[__G,,,__G,,]} !arpeggio![__D,__G,__B,__D__G]6!ped-up!|[V:4]x6|
[V:1]!fermata![_F,__D_F]6|][V:2]x6|][V:3]!fermata![__D,,__A,,__D,]6|][V:4]{/!fermata!__D,,,} !fermata!D,,,6|]`;

const abcScore3 = `X:1
%%score { ( 1 4 ) | 2 }
L:1/8
M:2/4
K:Bb
V:1 treble nm="Piano" snm="Pno."
V:4 treble
V:2 bass
V:3 bass
[V:1]"^Allegretto"!p! f|[V:2]z1|[V:3]x1|[V:4]x1|
[V:1](f3/2g/4a/4) .b.b|[V:2][K:treble] (D/B/F/B/ D/B/F/B/|[V:3][K:treble] x4|[V:4]x4|
[V:1](b2 a) z|[V:2]E/B/F/B/ E/B/F/B/)|[V:3]x4|[V:4]x4|
[V:1](f3/2a/4b/4) .c'.c'|[V:2](E/c/F/c/ E/c/F/c/|[V:3]x4|[V:4]x4|
[V:1](c'2 b) z|[V:2]D/B/F/B/ D/B/F/B/)|[V:3]x4|[V:4]x4|
[V:1]!f! (b3/2c'/4d'/4) .e'.e'|[V:2][K:bass] (D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3][K:bass] x4|[V:4]x4|
[V:1](e'/d'/c'/b/ a/g/f/e/)|[V:2]E,/B,/G,/B,/ E,/B,/G,/B,/)|[V:3]x4|[V:4]x4|
[V:1](d/f/b/f/) (f/e/d/c/)|[V:2](F,/D/B,/D/ F,/E/C/E/)|[V:3]x4|[V:4]x4|
[V:1]B2 z!p! F|[V:2](B,/F/D/F/ B,) z|[V:3]x4|[V:4]x4|
[V:1](F3/2G/4A/4) .B.B|[V:2](D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3]x4|[V:4]x4|
[V:1](B2 A) z|[V:2]E,/B,/F,/B,/ E,/B,/F,/B,/)|[V:3]x4|[V:4]x4|
[V:1](F3/2A/4B/4) .c.c|[V:2](E,/C/F,/C/ E,/C/F,/C/|[V:3]x4|[V:4]x4|
[V:1](c2 B) z|[V:2]D,/B,/F,/B,/ D,/B,/F,/B,/)|[V:3]x4|[V:4]x4|
[V:1]!f! (B3/2c/4d/4) .e.e|[V:2](D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3]x4|[V:4]x4|
[V:1](e/d/c/B/ A/G/F/E/)|[V:2]E,/B,/G,/B,/ E,/B,/G,/B,/)|[V:3]x4|[V:4]x4|
[V:1](D/F/B/F/) (F/E/D/C/)|[V:2](F,,/D,/B,,/D,/ F,,/E,/C,/E,/)|[V:3]x4|[V:4]x4|
[V:1]B,2 z!p! (B|[V:2]B,,/F,/D,/F,/ B,, z|[V:3]x4|[V:4]x4|
[V:1]ABcd)|[V:2][K:treble] (FGAB)|[V:3][K:treble] x4|[V:4]x4|
[V:1](fe) z d|[V:2]z (cAB)|[V:3]x4|[V:4]x4|
[V:1](gf)(ba)|[V:2](edcB)|[V:3]x4|[V:4]x4|
[V:1](c'>a) f z|[V:2][FA]2 z2|[V:3]x4|[V:4]x4|
[V:1]!f! (c'2 b/a/g/f/)|[V:2][K:bass] A,/F/C/F/ A,/F/C/F/|[V:3][K:bass] x4|[V:4]x4|
[V:1](=ed) d2|[V:2]B,/F/D/F/ B,/F/D/F/|[V:3]x4|[V:4]x4|
[V:1](d'/c'/b/a/ g/f/=e/d/)|[V:2]B,/G/D/G/ B,/G/D/G/|[V:3]x4|[V:4]x4|
[V:1](f=e) e2|[V:2]B,/G/C/G/ B,/G/C/G/|[V:3]x4|[V:4]x4|
[V:1](c'2 b/a/g/f/)|[V:2]A,/F/C/F/ A,/F/C/F/|[V:3]x4|[V:4]x4|
[V:1](=edbg)|[V:2]B,/G/D/G/ B,/G/D/G/|[V:3]x4|[V:4]x4|
[V:1](f2 ag)|[V:2][K:treble] C/A/F/A/ C/c/B/c/|[V:3][K:treble] x4|[V:4]x4|
[V:1]f!p! (.[ac'].[gb].[fa])|[V:2][FA]2 z2|[V:3]x4|[V:4]x4|
[V:1]!f! (c'2 b/a/g/f/)|[V:2][K:bass] A,/F/C/F/ A,/F/C/F/|[V:3][K:bass] x4|[V:4]x4|
[V:1](=ed) d2|[V:2]B,/F/D/F/ B,/F/D/F/|[V:3]x4|[V:4]x4|
[V:1](d'/c'/b/a/ g/f/=e/d/)|[V:2]B,/G/D/G/ B,/G/D/G/|[V:3]x4|[V:4]x4|
[V:1](f=e) e2|[V:2]B,/G/C/G/ B,/G/C/G/|[V:3]x4|[V:4]x4|
[V:1](c'2 b/a/g/f/)|[V:2]A,/F/C/F/ A,/F/C/F/|[V:3]x4|[V:4]x4|
[V:1](=edbg)|[V:2]B,/G/D/G/ B,/G/D/G/|[V:3]x4|[V:4]x4|
[V:1](f2 ag)|[V:2][K:treble] C/A/F/A/ C/c/B/c/|[V:3][K:treble] x4|[V:4]x4|
[V:1]f/!p!(c/d/c/ f/c/a/f/)|[V:2][FA]2 z2|[V:3]x4|[V:4]x4|
[V:1].c' ([Ac][Bd][G=e])|[V:2][K:bass] z (FB,C)|[V:3][K:bass] x4|[V:4]x4|
[V:1][Af]/(c/d/c/ f/c/a/f/)|[V:2]F,2 z2|[V:3]x4|[V:4]x4|
[V:1].c' ([Ac][Bd][G=e])|[V:2]z (FB,C)|[V:3]x4|[V:4]x4|
[V:1](f2 ag)|[V:2](F,/C/A,/C/ C,/B,/G,/B,/)|[V:3]x4|[V:4]F2 =e2|
[V:1](f2 ag)|[V:2](F,/C/A,/C/ C,/B,/G,/B,/)|[V:3]x4|[V:4]f2 =e2|
[V:1][Af][Af][Af]|[V:2](F,,/F,/A,,/F,/ C,/F,/A,,/F,/|[V:3]x3|[V:4]x3|
[V:1][Af]2 z::[V:2]F,,2) z::[V:3]x3::[V:4]x3::
[V:1]!p! (F|[V:2]z1|[V:3]x1|[V:4]x1|
[V:1]_GF=EF)|[V:2]z2 z (F,|[V:3]x4|[V:4]x4|
[V:1](C_DE) (F|[V:2]_G,F,E,F,)|[V:3]x4|[V:4]x4|
[V:1]_GF=EF)|[V:2](C,_D,E,) (F,|[V:3]x4|[V:4]x4|
[V:1](C_DE) (F|[V:2]_G,F,=E,F,)|[V:3]x4|[V:4]x4|
[V:1]"_cresc." _GF=EF)|[V:2](C,_D,E,F,)|[V:3]x4|[V:4]x4|
[V:1](_A_GFE)|[V:2](B,,2 C,2)|[V:3]x4|[V:4]x4|
[V:1]!f! _D [B_d]2 [Bd]|[V:2](_D,B,,_G,,=E,,)|[V:3]x4|[V:4]x4|
[V:1][Ac]2 z!p! (f|[V:2]F,,2 z2|[V:3]x4|[V:4]x4|
[V:1](f3/2)g/4a/4) .b.b|[V:2][K:treble] (D/B/F/B/ D/B/F/B/|[V:3][K:treble] x4|[V:4]x4|
[V:1](b2 a) z|[V:2]E/B/F/B/ E/B/F/B/)|[V:3]x4|[V:4]x4|
[V:1](f3/2a/4b/4) .c'.c'|[V:2](E/c/F/c/ E/c/F/c/|[V:3]x4|[V:4]x4|
[V:1](c'2 b) z|[V:2]D/B/F/B/ D/B/F/B/)|[V:3]x4|[V:4]x4|
[V:1]!f! (b3/2c'/4d'/4) .e'.e'|[V:2][K:bass] (D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3][K:bass] x4|[V:4]x4|
[V:1](e'/d'/c'/b/ a/g/f/e/)|[V:2]E,/B,/G,/B,/ E,/B,/G,/B,/)|[V:3]x4|[V:4]x4|
[V:1](d/f/b/f/) (f/e/d/c/)|[V:2](F,/D/B,/D/ F,/E/C/E/)|[V:3]x4|[V:4]x4|
[V:1]B2 z!p! (B|[V:2](B,/F/D/F/ B,) z|[V:3]x4|[V:4]x4|
[V:1]ABcd)|[V:2][K:treble] (FGAB)|[V:3][K:treble] x4|[V:4]x4|
[V:1](fe) z d|[V:2]z (cAB)|[V:3]x4|[V:4]x4|
[V:1](gf)(ba)|[V:2](edcB)|[V:3]x4|[V:4]x4|
[V:1](c'>a) f z|[V:2][FA]2 z2|[V:3]x4|[V:4]x4|
[V:1]!f! (f2 e/d/c/B/)|[V:2][K:bass] D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3][K:bass] x4|[V:4]x4|
[V:1](AG) G2|[V:2]E,/B,/G,/B,/ E,/B,/G,/B,/|[V:3]x4|[V:4]x4|
[V:1](g/f/e/d/ c/B/A/G/)|[V:2]E,/C/G,/C/ E,/C/G,/C/|[V:3]x4|[V:4]x4|
[V:1](BA) A2|[V:2]E,/C/F,/C/ E,/C/F,/C/|[V:3]x4|[V:4]x4|
[V:1](f2 e/d/c/B/)|[V:2]D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3]x4|[V:4]x4|
[V:1](AGec)|[V:2]E,/C/G,/C/ E,/C/G,/C/|[V:3]x4|[V:4]x4|
[V:1](B2 dc)|[V:2]F,/D/B,/D/ F,/F/E/F/|[V:3]x4|[V:4]x4|
[V:1]B!p! (.[df].[ce].[Bd])|[V:2][B,D]2 z2|[V:3]x4|[V:4]x4|
[V:1]!f! (f2 e/d/c/B/)|[V:2]D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3]x4|[V:4]x4|
[V:1](AG) G2|[V:2]E,/B,/G,/B,/ E,/B,/G,/B,/|[V:3]x4|[V:4]x4|
[V:1](g/f/e/d/ c/B/A/G/)|[V:2]E,/C/G,/C/ E,/C/G,/C/|[V:3]x4|[V:4]x4|
[V:1](BA) A2|[V:2]E,/C/F,/C/ E,/C/F,/C/|[V:3]x4|[V:4]x4|
[V:1](f2 e/d/c/B/)|[V:2]D,/B,/F,/B,/ D,/B,/F,/B,/|[V:3]x4|[V:4]x4|
[V:1](AGec)|[V:2]E,/C/G,/C/ E,/C/G,/C/|[V:3]x4|[V:4]x4|
[V:1](B2 dc)|[V:2]F,/D/B,/D/ F,/F/E/F/|[V:3]x4|[V:4]x4|
[V:1]B/!p!(F/G/F/ B/F/d/B/)|[V:2][B,D]2 z2|[V:3]x4|[V:4]x4|
[V:1].f ([DF][EG][CA])|[V:2]z (B,E,F,)|[V:3]x4|[V:4]x4|
[V:1][DB]/(F/G/F/ B/F/d/B/)|[V:2]B,,2 z2|[V:3]x4|[V:4]x4|
[V:1].f ([DF][EG][CA])|[V:2]z (B,E,F,)|[V:3]x4|[V:4]x4|
[V:1](B2 dc)|[V:2](B,,/F,/D,/F,/ F,,/E,/C,/E,/)|[V:3]x4|[V:4]B,2 A2|
[V:1](B2 dc)|[V:2](B,,/F,/D,/F,/ F,,/E,/C,/E,/)|[V:3]x4|[V:4]B2 A2|
[V:1][DB][DB][DB][DB]|[V:2](B,,,/B,,/D,,/B,,/ F,,/B,,/D,,/B,,/|[V:3]x4|[V:4]x4|
[V:1][DB]2 z:|[V:2]B,,,2) z:|[V:3]x3:|[V:4]x3:|`;

export default function JSPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Collaborating on a Composition with AI</h1>
        <p>
          Generative Models can be helpful for writing code. Can they also be
          part of a creative composition process? In this post I will document
          my experience using NotaGen as a compositional collaborator.
        </p>

        <h2>Generative Experiments</h2>
        <p>
          The NotaGen Model is a transformer-based model that generates scores
          in ABC notation. It accepts three parameters to condition score
          generation: Title, Period, and Composer. First I experimented with the
          model inputs to generate the scores below.
        </p>

        <GenerationObservations
          title="Generation Experiment 1"
          period="Baroque"
          composer="Scarlatti, Domenico"
          instrumentation="Keyboard"
          abcScore={abcScore1}
          observations="I’m not very familiar with Scarlatti’s compositions, but when I played the piece for my classical pianist friend, he said it wasn’t even close. Personally, this one is my least favorite of the three generation experiments."
        />

        <GenerationObservations
          title="Generation Experiment 2"
          period="Classical"
          composer="Mozart, Wolfgang Amadeus"
          instrumentation="Keyboard"
          abcScore={abcScore2}
          observations="I could recognize that the program attempted to generate music in the style of Mozart. While some parts sounded a bit unusual, there were also sections that I found musically enjoyable."
        />

        <GenerationObservations
          title="Generation Experiment 3"
          period="Romantic"
          composer="Chopin, Frederic"
          instrumentation="Keyboard"
          abcScore={abcScore3}
          observations="I think this is the most authentic of the three. Although I still notice some strange moments, several passages are quite musically enjoyable."
        />

        <h2>My Original Composition</h2>


        <p>
          <TODO />: Add your audio file here. <strong>Be VERY careful about how you
          add your audio file to git!</strong> You will need to put your audio
          file in the <code>/website/public/students/your-name/</code> directory
          and then update the <code>src</code> attribute of the <code>audio</code>
          element to below point to your file. Note that this is NOT in the
          <code>app/</code> directory with the rest of your code.
        </p>
        
        <audio src="/students/fumiya/hw5.wav" controls />

        <p>
          For this composition, I used the output from my Generation Experiment 1. First, I downloaded the MIDI file and imported it into my DAW. From there, I created a six-measure loop and used it as the foundation for the main chord progression and melody. After establishing this core idea, I added other musical elements, including drums, bass, and synthesizer layers, to build a fuller arrangement.
          Collaborating with the AI model was a very inspiring experience. It helped me generate musical ideas that I wouldn’t have come up with on my own. The chord progression and melody felt fresh and unexpected, almost like working with another artist who brings a completely different creative perspective. While the model provided the initial spark, I was able to shape and develop the idea further using my own musical judgment.
        </p>
      </div>
    </div>
  );
}

function GenerationObservations({
  title,
  period,
  composer,
  instrumentation,
  abcScore,
  observations,
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div>Model Prompt:</div>
      <ul>
        <li>Period: {period}</li>
        <li>Composer: {composer}</li>
        <li>Instrumentation: {instrumentation}</li>
      </ul>
      <AbcPlayer abc={abcScore} hideScore={true} />
      <AbcMidiLink abc={abcScore} />
      <Toggle title="View Score">
        <Abc abc={abcScore} />
      </Toggle>
      <h4>My Observations</h4>
      <p>{observations}</p>
    </div>
  );
}

function TODO() {
  return <span className="text-red-500 font-bold">TODO</span>
}
