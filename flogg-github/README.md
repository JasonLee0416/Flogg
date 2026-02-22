# 🌸 Flogg

**Flower Delivery Log** — 화환 배송 인수증 관리 앱

화환 업계 종사자를 위한 인수증 촬영, AI 자동 분석, 기록 관리 앱입니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 📷 **인수증 스캔** | 단일/연사 모드 카메라 촬영 |
| 🤖 **AI OCR** | GPT-4o / Gemini 기반 자동 데이터 추출 |
| 🏠 **오늘 대시보드** | 당일 기록 + 합계 카드 |
| 📋 **전체 기록** | 날짜별 그룹핑 (오늘/어제/날짜) |
| ✏️ **수정/삭제** | 인수증 상세 보기 + 수동 교정 |
| 🌐 **다국어** | 한국어 / English 전환 |
| 🌙 **다크 모드** | 시스템 연동 / 수동 설정 |
| 💾 **로컬 저장** | SQLite 오프라인 데이터 |
| ⚙️ **통합 설정** | 언어, 테마, 카메라, AI 엔진, 햅틱 |

## 스크린샷

> 앱 실행 후 스크린샷을 추가하세요.

## 기술 스택

- **Framework**: React Native (Expo SDK 52)
- **Database**: expo-sqlite (SQLite)
- **Navigation**: React Navigation 7 (Bottom Tabs + Native Stack)
- **AI OCR**: OpenAI GPT-4o / Google Gemini 1.5 Flash
- **State**: React Context + AsyncStorage
- **Language**: JavaScript (ES2022)

## 프로젝트 구조

```
flogg/
├── App.js                        # 탭 네비게이션 + 루트
├── app.json                      # Expo 설정
├── package.json                  # 의존성
├── build.bat                     # Windows APK 빌드 스크립트
│
├── assets/
│   ├── icon.png                  # 앱 아이콘
│   ├── adaptive-icon.png         # Android 적응형 아이콘
│   ├── splash-icon.png           # 스플래시 아이콘
│   └── fonts/                    # 커스텀 폰트 (옵션)
│
└── src/
    ├── screens/
    │   ├── HomeScreen.js         # 홈 — 오늘 기록 + 합계
    │   ├── ScanScreen.js         # 카메라 — 단일/연사 모드
    │   ├── HistoryScreen.js      # 기록 — 날짜별 전체 기록
    │   ├── DetailScreen.js       # 상세 — 보기/수정/삭제
    │   └── SettingsSheet.js      # 설정 — 모달 시트
    │
    ├── context/
    │   └── SettingsContext.js     # 설정 상태 + AsyncStorage
    │
    ├── database/
    │   ├── db.js                 # SQLite CRUD
    │   └── DatabaseContext.js    # DB React Context
    │
    ├── services/
    │   └── visionApi.js          # GPT-4o / Gemini OCR
    │
    ├── utils/
    │   └── theme.js              # iOS HIG 색상 + 간격 토큰
    │
    └── i18n/
        └── strings.js            # 한국어 / English
```

## 시작하기

### 요구사항

- Node.js 18+
- Android Studio (JBR JDK 포함)
- Android SDK

### 설치 & 실행

```bash
# 클론
git clone https://github.com/YOUR_USERNAME/flogg.git
cd flogg

# 의존성 설치
npm install

# 버전 호환성 자동 맞춤
npx expo install --fix

# 개발 서버 실행
npx expo start
```

### APK 빌드 (Windows)

**방법 1: 스크립트 실행**
```
build.bat 더블클릭
```

**방법 2: 수동 빌드**
```cmd
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
npm install
npx expo install --fix
npx expo prebuild --platform android --clean
npx expo run:android --variant release
```

빌드 완료 후 APK 위치:
```
android\app\build\outputs\apk\release\app-release.apk
```

## AI API 설정

`src/services/visionApi.js`에서 API 키를 설정하세요:

```js
const CONFIG = {
  OPENAI_API_KEY: 'sk-...',     // GPT-4o
  GEMINI_API_KEY: 'AIza...',    // Gemini (대안)
};
```

> ⚠️ API 키 미설정 시 **데모 데이터**로 자동 동작합니다.
>
> 실제 배포 시 `.env` 파일로 관리하세요.

## 설정 옵션

| 카테고리 | 항목 | 옵션 |
|---------|------|------|
| 🌐 언어 | 인터페이스 언어 | 한국어 / English |
| 🌙 화면 | 다크 모드 | ON / OFF / 시스템 |
| 📷 카메라 | 촬영 모드 | 단일 / 연사 |
| 📷 카메라 | 이미지 품질 | 낮음 / 높음 |
| 🤖 AI | 엔진 선택 | GPT-4o / Gemini |
| 🤖 AI | 자동 분석 | ON / OFF |
| 📳 일반 | 햅틱 피드백 | ON / OFF |

## 라이선스

MIT License

## 문의

이슈 및 PR 환영합니다.
