'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'
import { AbcPlayer, Abc, AbcMidiLink } from '@/components/abc'
import Toggle from '@/components/Toggle'

const abcScore = `X:1
T:Romantic Debussy Style Piece
M:3/4
L:1/8
Q:1/4=144
K:D
V:1 treble nm="Piano" snm="Pno."
V:2 bass
[V:1]"^Allegretto sostenuto"!pp! z6|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]z6|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]!p! (d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]g2 a3 b|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]c'4 ba|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]gf e3 f|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]ga b3 c'|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]f'4 e'd'|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]c'b a3 g|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]!p! (f4 ^g^a|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]b2 c'3 d'|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]e'4 d'c'|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]b^a g3 a|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]f4 ^g^a|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]bc' d'3 e'|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]f'4 e'd'|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]c'b ^a3 c'|[V:2]z2 .[CEG]2 .[^A,CF]2|
[V:1]!pp! (d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]ga b3 c'|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]d'4 =c'b|[V:2]z2 .[E,G,B,]2 .[F,G,B,]2|
[V:1]ag f3 g|[V:2]z2 .[G,A,B,]2 .[E,G,B,]2|
[V:1]!pp! (_a4 g=f|[V:2]z2 .[=F,_A,=C]2 .[G,A,C]2|
[V:1]_ed =c3 d)|[V:2]z2 .[_A,_B,=C]2 .[=F,A,C]2|
[V:1](_e4 d=c|[V:2]z2 .[_E,G,=C]2 .[=F,_A,C]2|
[V:1]_B_A G3 A)|[V:2]z2 .[G,_A,=C]2 .[_E,G,C]2|
[V:1]"_cresc." (_B4 =cd|[V:2]z2 .[D,G,_B,]2 .[_E,G,B,]2|
[V:1]_e=f g3 _a)|[V:2]z2 .[=F,G,_B,]2 .[D,G,B,]2|
[V:1]!f! (_b4 _ag|[V:2]z2 .[=C,_E,G,]2 .[D,E,G,]2|
[V:1]=f_e d3 =c)|[V:2]z2 .[_E,=F,G,]2 .[=C,E,G,]2|
[V:1]!p! (_B6-|[V:2].G,,2 .[D,G,_B,]2 .[_E,G,B,]2|
[V:1]B2 =c3 d)|[V:2].=F,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]!pp! (_e6-|[V:2]._E,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]e2 d3 =c)|[V:2].=F,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]!pp! (F6-|[V:2].D,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]F2 G3 A)|[V:2].C,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]!pp! (B6-|[V:2].B,,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]B2 A3 G)|[V:2].C,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]!pp! (=f4 ga|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_b2 =c'3 d'|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]e'4 d'=c'|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_ba g3 a|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]=f4 ga|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_b=c' d'3 e'|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]a'4 g'=f'|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]e'd' =c'3 _b|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]!pp! (a4 bc'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'2 e'3 f'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]g'4 f'e'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'c' b3 c'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]a4 bc'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'e' f'3 g'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]a'4 g'f'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]e'd' c'3 e'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]!pp! (f'4 e'd'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2]z2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2]z2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c'|[V:2]z6|
[V:1].d'2) z2 z2|[V:2].D,,2 z2 z2|
[V:1].[d'd'']2 z2 !fermata!z2|[V:2][K:treble] .[DAf]2 z2 !fermata!z2|]`

const abcScore2 = `X:1
T:Romantic Chopin Style Piece
M:6/8
L:1/8
K:Eb
V:1 treble nm="Piano"
V:2 bass
[V:1]"^Andante con moto"!p! z6|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]z6|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]!p! (d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]g2 a3 b|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]c'4 ba|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]gf e3 f|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]ga b3 c'|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]f'4 e'd'|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]c'b a3 g|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]!p! (f4 ^g^a|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]b2 c'3 d'|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]e'4 d'c'|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]b^a g3 a|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]f4 ^g^a|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]bc' d'3 e'|[V:2]z2 .[CEG]2 .[B,DG]2|
[V:1]f'4 e'd'|[V:2]z2 .[^A,CF]2 .[B,DF]2|
[V:1]c'b ^a3 c'|[V:2]z2 .[CEG]2 .[^A,CF]2|
[V:1]!pp! (d4 ef|[V:2]z2 .[A,DF]2 .[B,DG]2|
[V:1]ga b3 c'|[V:2]z2 .[CEA]2 .[B,DG]2|
[V:1]d'4 =c'b|[V:2]z2 .[E,G,B,]2 .[F,G,B,]2|
[V:1]ag f3 g|[V:2]z2 .[G,A,B,]2 .[E,G,B,]2|
[V:1]!pp! (_a4 g=f|[V:2]z2 .[=F,_A,=C]2 .[G,A,C]2|
[V:1]_ed =c3 d)|[V:2]z2 .[_A,_B,=C]2 .[=F,A,C]2|
[V:1](_e4 d=c|[V:2]z2 .[_E,G,=C]2 .[=F,_A,C]2|
[V:1]_B_A G3 A)|[V:2]z2 .[G,_A,=C]2 .[_E,G,C]2|
[V:1]"_cresc." (_B4 =cd|[V:2]z2 .[D,G,_B,]2 .[_E,G,B,]2|
[V:1]_e=f g3 _a)|[V:2]z2 .[=F,G,_B,]2 .[D,G,B,]2|
[V:1]!f! (_b4 _ag|[V:2]z2 .[=C,_E,G,]2 .[D,E,G,]2|
[V:1]=f_e d3 =c)|[V:2]z2 .[_E,=F,G,]2 .[=C,E,G,]2|
[V:1]!p! (_B6-|[V:2].G,,2 .[D,G,_B,]2 .[_E,G,B,]2|
[V:1]B2 =c3 d)|[V:2].=F,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]!pp! (_e6-|[V:2]._E,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]e2 d3 =c)|[V:2].=F,,2 .[_E,G,_B,]2 .[=F,G,B,]2|
[V:1]!pp! (F6-|[V:2].D,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]F2 G3 A)|[V:2].C,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]!pp! (B6-|[V:2].B,,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]B2 A3 G)|[V:2].C,,2 .[D,F,A,]2 .[E,F,A,]2|
[V:1]!pp! (=f4 ga|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_b2 =c'3 d'|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]e'4 d'=c'|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_ba g3 a|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]=f4 ga|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]_b=c' d'3 e'|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]a'4 g'=f'|[V:2].=F,,2 .[A,=C=F]2 .[_B,DF]2|
[V:1]e'd' =c'3 _b|[V:2]z2 .[=CEG]2 .[_B,D=F]2|
[V:1]!pp! (a4 bc'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'2 e'3 f'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]g'4 f'e'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'c' b3 c'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]a4 bc'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]d'e' f'3 g'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]a'4 g'f'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]e'd' c'3 e'|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1]!pp! (f'4 e'd'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2].A,,2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2]z2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c')|[V:2]z2 .[B,DG]2 .[A,DF]2|
[V:1](f'4 e'd'|[V:2]z2 .[A,CE]2 .[A,DF]2|
[V:1]c'b a3 c'|[V:2]z6|
[V:1].d'2) z2 z2|[V:2].D,,2 z2 z2|
[V:1].[d'd'']2 z2 !fermata!z2|[V:2][K:treble] .[DAf]2 z2 !fermata!z2|]`

const abcScore3 = `X:1
T:Romantic Chopin Art Song
M:2/4
L:1/8
K:G
V:1 treble 
V:2 treble 
V:3 bass 
[V:1]"^Andante con moto" z4|[V:2]!p! ([B,GB][B,D]/)z/4([B,DG]/4 [CEG][CE]/)z/4([CE]/4|[V:3]([G,,,G,,]D,/)z/4(D,/4 G,,G,/)z/4(G,/4|
[V:1]z2 z z/!p! d/|[V:2][B,D][B,DGB] [A,DFA]2)|[V:3][G,,D,])[G,,D,] [D,,D,]2|
[V:1]d3/2 G/ G G/ A/|[V:2]([B,GB][B,D]/)z/4([B,D]/4 [CEG][CE]/)z/4([CE]/4|[V:3]([G,,,G,,]D,/)z/4(D,/4 G,,G,/)z/4(G,/4|
[V:1]B G A3/2 d/|[V:2][B,D][B,DGB] [A,DFA]2)|[V:3][G,,D,])[G,,D,] [D,,D,]2|
[V:1]d G/ G/ G3/2 A/|[V:2]([B,GB][B,D]/)z/4([B,D]/4 [CEG][CE]/)z/4([CE]/4|[V:3]([G,,,G,,]D,/)z/4(D,/4 G,,G,/)z/4(G,/4|
[V:1]B3/2 G/ A3/2 A/|[V:2][B,D][B,DGB] [A,DFA]2)|[V:3][G,,D,])[G,,D,] [D,,D,]2|
[V:1]!<(! B B/ B/ ^c3/2!<)! c/|[V:2]!<(! ([B,DB][B,D]/)z/4([B,DB]/4 [^CEB^c][CEB]/)!<)!z/4([CEBc]/4|[V:3]([G,,,G,,]D,/)z/4(D,/4 [G,,E,]G,/)z/4(G,/4|
[V:1]!mf!!>(! d3/2!>)! B/!p! B3/2 ^c/|[V:2]!mf!!>(! [DFBd][B,DFB]/)!>)!z/4!p!([B,DFB]/4 [^CEB^c][CEBc]/)z/4([CEBc]/4|[V:3][B,,F,]F,/)z/4(F,/4 [G,,E,]G,/)z/4(G,/4|
[V:1]d ^c/ B/ c ^A|[V:2][DFBd][^CF^c]/[B,FB]/ [CE^Ac][^A,EFA]|[V:3][F,,F,]F,/)z/4(F,/4 F,F,|
[V:1]B2 z z/!pp! B/|[V:2][B,DFB])!pp![B,DF][B,DG][B,^DA]|[V:3]B,,)[B,,F,][B,,G,][B,,F,]|
[V:1]c3/2 F/ F G/ A/|[V:2]([CFA][CF]/)z/4([CF]/4 [CEA][CE]/)z/4([CE]/4|[V:3]([D,,,D,,]D,/)z/4(D,/4 G,D,/)z/4(D,/4|
[V:1]B G D3/2 B/|[V:2][B,D][B,DG] [B,D]2)|[V:3][G,,D,])[D,G,] [G,,D,]2|
[V:1]c3/2 F/ F G/ A/|[V:2]([CFA][CF]/)z/4([CF]/4 [CEA][CE]/)z/4([CE]/4|[V:3]([D,,,D,,]D,/)z/4(D,/4 G,D,/)z/4(D,/4|
[V:1]B G D3/2 D/|[V:2][B,D][B,DG] [B,D]2)|[V:3][G,,D,])[D,G,] [G,,D,]2|
[V:1]"^cresc." E E/ E/ F3/2 F/|[V:2]"_cresc." ([E,G,CE][E,G,C]/)z/4([E,G,CE]/4 [F,A,CF][F,A,C]/)z/4([F,A,CF]/4|[V:3]([C,,,C,,]C,/)z/4(C,/4 [A,,,A,,]C,/)z/4(C,/4|
[V:1]G3/2 G/ A3/2 A/|[V:2][G,B,EG][G,B,E]/)z/4([G,B,EG]/4 [A,CEA][A,CE]/)z/4([A,CEA]/4|[V:3][E,,,E,,]E,/)z/4(E,/4 [C,,C,]E,/)z/4(E,/4|
[V:1]!mf!!>(! B A/ G/ A F|[V:2]!mf!!>(! [B,DGB][A,DFA]/[G,DG]/ [A,DFA][F,CDF]|[V:3][D,,D,]D,/)z/4(D,/4 D,D,|
[V:1]G2!>)! z2|[V:2][G,B,DG])!>)!!pp![B,D][CE][B,D]|[V:3][G,,D,])[G,,D,][G,,E,][G,,D,]|
[V:1]z4|[V:2](!>![^CGB][=CFA]/)z/4([CF^G]/4 [CFB][CFA]|[V:3](!>![G,,_E,][G,,D,]/)z/4([G,,D,]/4 [G,,D,][G,,D,]|
[V:1]z2 z!p! D|[V:2][B,DG][B,D] [B,D]2)|[V:3][G,,D,])[G,,D,] [G,,D,]2|
[V:1]E3/2 A/ (A/B/) c|[V:2]([CEA][CE]/)z/4([CE]/4 [CEA][CE])|[V:3]([G,,,G,,]D,/)z/4(D,/4 D,D,)|
[V:1](DG) G3/2 D/|[V:2]([B,DG][B,D]/)z/4([B,D]/4 [B,DG][B,D])|[V:3]([G,,,G,,]D,/)z/4(D,/4 D,D,)|
[V:1]D3/2 F/ (F/G/) A/ D/|[V:2]([A,CF][A,C]/)z/4([A,C]/4 [A,CF][A,C])|[V:3]([G,,,G,,]D,/)z/4(D,/4 D,D,)|
[V:1]B2 z B|[V:2]([G,B,G][G,B,]/)z/4([G,B,]/4 [G,B,G][G,B,])|[V:3]([G,,,G,,]D,/)z/4(D,/4 D,D,)|
[V:1]"^cresc." ^c3/2 F/ F (^G/^A/)|[V:2]"_cresc." ([EF^c][EF^A]/)z/4([EFA]/4 [EFc][EF])|[V:3]([F,,,F,,]F,/)z/4(F,/4 F,F,)|
[V:1]!mf! (B>^d) d3/2 ^c/|[V:2]!mf! ([^DF^d][DFB]/)z/4([DFB]/4 [DFd][DF^c]/)z/4([DFc]/4|[V:3]([B,,,B,,]F,/)z/4(F,/4 F,F,)|
[V:1]B3/2 ^G/ ^A3/2 B/|[V:2][B,^EB][B,E^G]/)z/4([B,EG]/4 [B,E^A][B,EG]/)z/4([B,EG]/4|[V:3]([^C,,^C,]C,/)z/4(C,/4 C,C,)|
[V:1]^c3 z/ c/|[V:2][^A,F^c][A,F]/)z/4([A,F]/4 [A,Fc][A,F]/)z/4([A,F]/4|[V:3]([F,,,F,,]F,/)z/4(F,/4 F,F,)|
[V:1]"^dim." c3/2 E/ E (F/G/)|[V:2]"_dim." [A,Ec][A,E]/)z/4([A,E]/4 [A,Ec][A,E]/)z/4([A,E]/4|[V:3]([F,,,F,,]F,/)z/4(F,/4 F,F,)|
[V:1]!p! F2 B3/2 B/|[V:2]!p! [B,^DB][B,D]/)z/4([B,D]/4 [B,DB][B,D]/)z/4([B,D]/4|[V:3]([B,,,B,,]F,/)z/4(F,/4 F,F,)|
[V:1]A3/2 E/ E (F/G/)|[V:2][A,EA][A,E]/)z/4([A,E]/4 [A,EA][A,E]/)z/4([A,E]/4|[V:3]([C,,C,]F,/)z/4(F,/4 F,F,)|
[V:1]F2 z B|[V:2][B,^DB][B,D]/)z/4([B,D]/4 [B,DB][B,D]/)z/4([B,D]/4|[V:3]([B,,,B,,]F,/)z/4(F,/4 F,F,)|
[V:1]"^cresc." A3/2 B/ c e|[V:2]"_cresc." [CEA][CE]/)z/4([CE]/4 [CEc][CE]/)z/4([CE]/4|[V:3]([C,,C,]F,/)z/4(F,/4 [A,,F,]F,/)z/4(F,/4|
[V:1]!f!"^dim." (dg- g/f/) (e/d/)|[V:2]!f!"_dim." [DGd][DG]/)z/4([DG]/4 [DGd][DGd]/)z/4([DGd]/4|[V:3][B,,,B,,]G,/)z/4(G,/4 G,G,)|
[V:1][Q:1/4=76]"^T" (c/B/)[Q:1/4=74]"^T" (A/G/)[Q:1/4=72]"^T" F A|[V:2][CEc][CEB]/)z/4([CEA]/4 [CDFA][CDF])|[V:3]([C,,C,]"^dim."C,/)z/4(C,/4 D,D,)|
[V:1][Q:1/4=78]"^a tempo" G2 z2|[V:2]!pp! G4-|[V:3]"^rit." D,2 E,_E,|
[V:1]z4|][V:2]G2 z2|][V:3]D,2 z2|]`

export default function HW5Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>HW5: Musical Analysis</h1>

        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
{`Period: Romantic
Composer: Debussy
Instrumentation: Keyboard

Score`}
        </pre>

        <GenerationObservations
          title="Generation Experiment 1"
          period="Romantic"
          composer="Debussy"
          instrumentation="Keyboard"
          abcScore={abcScore}
          observations="This piece shows clear influences from Bach's fugues and Chopin's piano works, particularly the Nocturne No. 1 and Nocturne No. 2. The structure is solid with logical harmonic motion, though the MIDI performance lacks natural phrasing and piano touch."
        />

        <GenerationObservations
          title="Generation Experiment 2"
          period="Romantic"
          composer="Chopin"
          instrumentation="Keyboard"
          abcScore={abcScore2}
          observations="This Chopin-style piece demonstrates the model's ability to capture Romantic period characteristics with complex pedal markings and expressive dynamics. The 6/8 time signature and Eb major key signature are typical of Chopin's nocturnes."
        />

        <GenerationObservations
          title="Generation Experiment 3"
          period="Romantic"
          composer="Chopin"
          instrumentation="Art Song"
          abcScore={abcScore3}
          observations="This art song format shows the model adapting to vocal music with multiple voice parts. The 2/4 time signature and G major key are appropriate for art song, though the complex voice leading suggests more instrumental than vocal writing."
        />

        <h2>Original Composition</h2>
        <p>Here is my original composition based on the generated material:</p>
        <audio src="/students/Wanlin/hw5.mp3" controls />

        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
{`My Observations: Because I studied classical music and played piano when I was very young, it was really interesting to experiment with this piece. When the model generated the music for me, I could immediately recognize where some of the ideas came from — especially influences from Bach's fugues and Chopin's piano works, like Nocturne No. 1 and Nocturne No. 2, which I've played before.

However, I think the MIDI performance sounded quite poor, since it didn't follow the natural phrasing and touch we usually use on a real piano — it made the piece feel a bit unnatural. Still, the structure is solid, and the chord progression follows tonal harmony rules well. The harmonic motion feels logical and satisfying. Overall, it's pretty impressive for me.

Process and Reflection

For my process, I adjusted many of the notes slightly to shape the dynamics more naturally. I also experimented with changing the instrument sounds and thought about making it playable by real instruments. I added some noise and small sound effects to create a nostalgic atmosphere.

I used the model to generate the MIDI, then imported it into my DAW for further editing. I even tried to sample it with a beat, but it didn't really work — the tone was too mellow to blend well. I also discussed the result with a friend who studies composition. She said the melody mostly moves by step and that the materials feel a bit like "assembled fragments." I think that's fair.

Overall, I believe these kinds of models can be helpful in building structure or finding inspiration for texture, especially in tonal music. For classical music in particular, they still have clear limitations when it comes to emotional expression, phrasing, and performance nuance.`}
        </pre>

        <ModuleFooter />
      </div>
    </div>
  )
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