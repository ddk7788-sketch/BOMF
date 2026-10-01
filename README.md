# 봄꽃한의원 소개 홈페이지

봄꽃한의원의 진료 안내와 병원 소개를 제공하는 정적 웹사이트입니다. HTML, CSS, JavaScript로 구성되어 별도 빌드 과정 없이 정적 파일 서버에서 확인할 수 있습니다.

## 로컬 미리보기

프로젝트 루트에서 아래 명령을 실행한 뒤 `http://localhost:4173/`을 엽니다.

```powershell
python -m http.server 4173
```

## 이미지 교체

- 첫 화면 이미지는 `home-content.js`의 `landing.src`와 `assets/bomkkot-landing-flower.png`를 사용합니다.
- 의료진·공간 사진은 같은 파일의 사진 경로와 캡션을 수정하면 교체할 수 있습니다.
- 사진 경로를 비워 두면 중립 회색 대체 영역이 표시됩니다.

사이트 색상, 글꼴, 레이아웃 기준은 `design.md`에 기록되어 있습니다.
