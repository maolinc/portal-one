#!/usr/bin/env python3
"""Generate the original SVG illustrations bundled with the demo seed data."""

from pathlib import Path


OUT = Path(__file__).resolve().parents[1] / "web" / "public" / "demo" / "media"


def frame(title, accent, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-labelledby="title">
  <title id="title">{title}</title>
  <rect width="1600" height="1000" fill="#071d2d"/>
  <path d="M0 170H1600M0 340H1600M0 510H1600M0 680H1600M0 850H1600" stroke="#16384a" stroke-width="2"/>
  <path d="M180 0V1000M420 0V1000M660 0V1000M900 0V1000M1140 0V1000M1380 0V1000" stroke="#102f40" stroke-width="2"/>
  <path d="M0 820C290 750 520 880 820 815C1110 752 1320 785 1600 710V1000H0Z" fill="#0b2a3d"/>
  <path d="M80 110H430" stroke="{accent}" stroke-width="12"/>
  {body}
</svg>
'''


SCENES = {
    "ocean-freight.svg": frame("Ocean freight demo illustration", "#36c2b4", '''
  <path d="M260 690H1160L1040 820H390Z" fill="#e8f2f0"/>
  <path d="M330 650H1080V700H330Z" fill="#ffcb66"/>
  <g fill="#2a7180"><rect x="390" y="530" width="150" height="110"/><rect x="550" y="530" width="150" height="110"/><rect x="710" y="530" width="150" height="110"/></g>
  <g fill="#36c2b4"><rect x="470" y="410" width="150" height="110"/><rect x="630" y="410" width="150" height="110"/><rect x="790" y="410" width="150" height="110"/></g>
  <path d="M1040 400V650M1040 400H1280M1280 400V720M1120 400V560" fill="none" stroke="#9bbcc2" stroke-width="24"/>
  <path d="M1110 565H1170L1140 625Z" fill="#ffcb66"/>
  <path d="M90 850C330 805 520 910 760 855C1010 798 1260 850 1510 780" fill="none" stroke="#36c2b4" stroke-width="18"/>
  <path d="M250 300C390 205 520 260 610 325M980 245C1100 175 1235 210 1325 285" fill="none" stroke="#e8f2f0" stroke-width="18" stroke-linecap="round" opacity=".8"/>
'''),
    "trade-compliance.svg": frame("Trade compliance demo illustration", "#ffcb66", '''
  <g transform="translate(245 220)"><rect width="560" height="610" rx="18" fill="#e8f2f0"/><rect x="75" y="95" width="260" height="28" fill="#9bbcc2"/><rect x="75" y="165" width="390" height="18" fill="#c7d9d9"/><rect x="75" y="215" width="340" height="18" fill="#c7d9d9"/><rect x="75" y="265" width="380" height="18" fill="#c7d9d9"/><circle cx="400" cy="455" r="95" fill="#36c2b4"/><path d="M350 455L388 494L462 406" fill="none" stroke="#071d2d" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/></g>
  <g transform="translate(900 410)"><path d="M0 130L220 0L440 130L220 260Z" fill="#ffcb66"/><path d="M0 130V390L220 520V260Z" fill="#b98230"/><path d="M440 130V390L220 520V260Z" fill="#dca848"/><path d="M220 0V260" stroke="#071d2d" stroke-width="18" opacity=".5"/></g>
  <path d="M850 250H1330M850 310H1200" stroke="#36c2b4" stroke-width="18" stroke-linecap="round"/>
'''),
    "smart-warehouse.svg": frame("Smart warehouse demo illustration", "#36c2b4", '''
  <path d="M210 235H1390V830H210Z" fill="#e8f2f0"/>
  <path d="M230 260L620 420V830H230ZM1370 260L980 420V830H1370Z" fill="#16384a"/>
  <g fill="#ffcb66"><rect x="280" y="355" width="250" height="100"/><rect x="280" y="485" width="250" height="100"/><rect x="280" y="615" width="250" height="100"/><rect x="1070" y="355" width="250" height="100"/><rect x="1070" y="485" width="250" height="100"/><rect x="1070" y="615" width="250" height="100"/></g>
  <path d="M800 830V415M640 830L760 415M960 830L840 415" stroke="#9bbcc2" stroke-width="12"/>
  <g transform="translate(650 650)"><rect width="260" height="120" rx="12" fill="#36c2b4"/><rect x="165" y="-85" width="90" height="90" fill="#36c2b4"/><circle cx="65" cy="130" r="38" fill="#071d2d"/><circle cx="205" cy="130" r="38" fill="#071d2d"/><path d="M260 20H330V150M330 125H410" fill="none" stroke="#ffcb66" stroke-width="22"/></g>
'''),
    "operations-team.svg": frame("Operations team demo illustration", "#ffcb66", '''
  <rect x="790" y="190" width="590" height="390" rx="24" fill="#e8f2f0"/>
  <path d="M870 475L980 355L1090 420L1250 265" fill="none" stroke="#36c2b4" stroke-width="24" stroke-linejoin="round"/>
  <g fill="#2a7180"><circle cx="360" cy="375" r="92"/><circle cx="605" cy="355" r="92"/><circle cx="500" cy="610" r="92"/></g>
  <g fill="#e8f2f0"><path d="M195 720C215 545 505 545 525 720Z"/><path d="M440 700C455 520 745 510 785 700Z"/><path d="M325 850C350 675 650 675 675 850Z"/></g>
  <path d="M760 700H1375L1280 850H850Z" fill="#ffcb66"/>
  <path d="M910 630H1215" stroke="#36c2b4" stroke-width="18" stroke-linecap="round"/>
'''),
    "electronics-case.svg": frame("Electronics supply chain case illustration", "#36c2b4", '''
  <rect x="230" y="210" width="790" height="620" rx="34" fill="#17495a"/>
  <g fill="none" stroke="#36c2b4" stroke-width="18"><path d="M330 340H530V520H760V710H910"/><path d="M330 690H480V585H645V360H900"/></g>
  <g fill="#ffcb66"><circle cx="330" cy="340" r="32"/><circle cx="530" cy="520" r="32"/><circle cx="760" cy="710" r="32"/><circle cx="900" cy="360" r="32"/></g>
  <rect x="520" y="380" width="250" height="250" rx="26" fill="#e8f2f0"/><path d="M565 470H725M565 525H690" stroke="#2a7180" stroke-width="20"/>
  <g transform="translate(1110 420)"><path d="M0 95L155 0L310 95L155 190Z" fill="#ffcb66"/><path d="M0 95V290L155 390V190Z" fill="#b98230"/><path d="M310 95V290L155 390V190Z" fill="#dca848"/></g>
'''),
    "retail-case.svg": frame("Retail distribution case illustration", "#ffcb66", '''
  <rect x="210" y="250" width="650" height="570" fill="#e8f2f0"/>
  <path d="M280 380H790M280 555H790M280 730H790" stroke="#2a7180" stroke-width="30"/>
  <g fill="#36c2b4"><rect x="320" y="300" width="90" height="65"/><rect x="455" y="290" width="75" height="75"/><rect x="590" y="305" width="120" height="60"/><rect x="320" y="470" width="120" height="70"/><rect x="490" y="460" width="85" height="80"/><rect x="635" y="480" width="90" height="60"/></g>
  <g fill="#ffcb66"><rect x="320" y="645" width="75" height="70"/><rect x="455" y="630" width="110" height="85"/><rect x="625" y="650" width="100" height="65"/></g>
  <path d="M980 705C1060 600 1120 520 1220 400C1290 320 1360 270 1425 230" fill="none" stroke="#36c2b4" stroke-width="22" stroke-linecap="round"/>
  <g fill="#ffcb66"><circle cx="980" cy="705" r="38"/><circle cx="1125" cy="515" r="38"/><circle cx="1255" cy="360" r="38"/><circle cx="1425" cy="230" r="38"/></g>
'''),
    "food-case.svg": frame("Food distribution case illustration", "#36c2b4", '''
  <g transform="translate(260 250)"><rect width="390" height="570" rx="28" fill="#e8f2f0"/><path d="M80 0C85-110 305-110 310 0" fill="none" stroke="#ffcb66" stroke-width="34"/><circle cx="195" cy="245" r="105" fill="#36c2b4"/><path d="M135 245C180 175 235 175 270 245C235 320 180 320 135 245Z" fill="#ffcb66"/></g>
  <g transform="translate(805 335)"><path d="M0 115L190 0L380 115L190 230Z" fill="#ffcb66"/><path d="M0 115V365L190 480V230Z" fill="#b98230"/><path d="M380 115V365L190 480V230Z" fill="#dca848"/></g>
  <path d="M1185 590H1390V775H1185Z" fill="#e8f2f0"/><circle cx="1235" cy="800" r="42" fill="#36c2b4"/><circle cx="1350" cy="800" r="42" fill="#36c2b4"/>
  <path d="M650 735H805" stroke="#36c2b4" stroke-width="22" stroke-dasharray="26 22"/>
'''),
    "video-poster.svg": frame("Supply chain overview video poster", "#ffcb66", '''
  <circle cx="800" cy="505" r="285" fill="#17495a" stroke="#36c2b4" stroke-width="20"/>
  <path d="M800 305C670 420 670 590 800 705M800 305C930 420 930 590 800 705M535 505H1065M585 390H1015M585 620H1015" fill="none" stroke="#9bbcc2" stroke-width="16"/>
  <circle cx="800" cy="505" r="105" fill="#ffcb66"/>
  <path d="M770 440L875 505L770 570Z" fill="#071d2d"/>
  <path d="M245 640H490L445 710H295Z" fill="#e8f2f0"/><path d="M1110 655H1355V750H1110Z" fill="#e8f2f0"/><circle cx="1165" cy="765" r="34" fill="#36c2b4"/><circle cx="1310" cy="765" r="34" fill="#36c2b4"/>
'''),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, content in SCENES.items():
        (OUT / filename).write_text(content, encoding="utf-8")
    print(f"generated {len(SCENES)} illustrations in {OUT}")


if __name__ == "__main__":
    main()
