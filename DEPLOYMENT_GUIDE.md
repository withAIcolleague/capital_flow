# 🚀 GitHub & Netlify 배포 가이드

## 📋 목차
- [GitHub 설정](#github-설정)
- [Netlify 배포](#netlify-배포)
- [자동 배포 설정](#자동-배포-설정)
- [문제 해결](#문제-해결)
- [고급 설정](#고급-설정)

---

## 🔧 GitHub 설정

### 1. GitHub 저장소 생성

#### **웹에서 생성**
1. **GitHub.com** 접속
2. **"New repository"** 클릭
3. **Repository name**: `capital_flow`
4. **Description**: `Global Capital Flow Monitor - 실시간 자본 흐름 모니터링 시스템`
5. **Public/Private** 선택
6. **"Create repository"** 클릭

#### **CLI로 생성**
```bash
# GitHub CLI 설치 (선택사항)
# Windows: winget install GitHub.cli
# macOS: brew install gh

# 로그인
gh auth login

# 저장소 생성
gh repo create capital_flow --public --description "Global Capital Flow Monitor"
```

### 2. 로컬 Git 설정

#### **기본 설정**
```bash
# Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 현재 프로젝트 디렉토리로 이동
cd capital_flow

# Git 초기화 (이미 되어있다면 생략)
git init
```

#### **원격 저장소 연결**
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/capital_flow.git

# 또는 SSH 사용
git remote add origin git@github.com:YOUR_USERNAME/capital_flow.git

# 원격 저장소 확인
git remote -v
```

### 3. 코드 업로드

#### **첫 번째 업로드**
```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Capital Flow Monitor project"

# 메인 브랜치로 설정
git branch -M main

# 원격 저장소에 푸시
git push -u origin main
```

#### **일반적인 업데이트**
```bash
# 변경사항 확인
git status

# 파일 추가
git add .

# 커밋
git commit -m "Add new features: API settings and pricing guide"

# 푸시
git push origin main
```

### 4. 브랜치 관리

#### **개발 브랜치 생성**
```bash
# 새 브랜치 생성 및 이동
git checkout -b feature/new-feature

# 작업 후 커밋
git add .
git commit -m "Add new feature"

# 원격에 푸시
git push -u origin feature/new-feature
```

#### **메인 브랜치로 병합**
```bash
# 메인 브랜치로 이동
git checkout main

# 브랜치 병합
git merge feature/new-feature

# 원격에 푸시
git push origin main
```

---

## 🌐 Netlify 배포

### 1. GitHub 연동 배포 (권장)

#### **Netlify 설정**
1. **Netlify.com** 접속
2. **"Sign up"** 또는 **"Log in"**
3. **"New site from Git"** 클릭
4. **"GitHub"** 선택
5. **저장소 선택**: `capital_flow`
6. **Branch**: `main` 선택

#### **빌드 설정**
```
Build command: npm run build
Publish directory: .next
```

#### **환경 변수 설정**
1. **Site settings** → **Environment variables**
2. **Add variable** 클릭
3. 필요한 환경 변수 추가:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   NODE_ENV=production
   ```

### 2. 드래그 앤 드롭 배포

#### **정적 파일 생성**
```bash
# 프로젝트 빌드
npm run build

# Next.js 정적 내보내기 설정
# next.config.js에 추가:
# output: 'export'
# trailingSlash: true
# images: { unoptimized: true }

# 정적 파일 생성
npm run export
```

#### **Netlify에 업로드**
1. **Netlify.com** 접속
2. **"Deploy manually"** 클릭
3. **`out` 폴더** 드래그 앤 드롭

### 3. Netlify CLI 사용

#### **CLI 설치 및 설정**
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 프로젝트 초기화
netlify init
```

#### **배포 명령어**
```bash
# 개발 서버 실행
netlify dev

# 미리보기 배포
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

---

## 🔄 자동 배포 설정

### 1. GitHub Webhook 설정

#### **Netlify에서 설정**
1. **Site settings** → **Build & deploy**
2. **Build hooks** → **Add build hook**
3. **Hook name**: `Deploy from GitHub`
4. **Branch**: `main`
5. **Build command**: `npm run build`
6. **Publish directory**: `.next`

#### **GitHub에서 설정**
1. **Repository** → **Settings** → **Webhooks**
2. **Add webhook** 클릭
3. **Payload URL**: Netlify에서 제공한 URL
4. **Content type**: `application/json`
5. **Events**: `Just the push event`
6. **Active** 체크

### 2. netlify.toml 설정

#### **파일 생성**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"
```

### 3. GitHub Actions 설정

#### **워크플로우 파일 생성**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: '.next'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🛠️ 문제 해결

### 1. Git 관련 문제

#### **원격 저장소 연결 오류**
```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 제거 후 재추가
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/capital_flow.git

# 연결 테스트
git remote show origin
```

#### **푸시 거부 오류**
```bash
# 원격 변경사항 가져오기
git pull origin main

# 충돌 해결 후
git add .
git commit -m "Resolve conflicts"
git push origin main

# 강제 푸시 (주의: 기존 히스토리 덮어씀)
git push -f origin main
```

#### **브랜치 충돌**
```bash
# 현재 브랜치 확인
git branch

# 메인 브랜치로 이동
git checkout main

# 원격과 동기화
git pull origin main

# 브랜치 병합
git merge feature-branch
```

### 2. Netlify 배포 문제

#### **빌드 실패**
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어
npm run build -- --no-cache
```

#### **환경 변수 문제**
```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=https://your-api.com
NODE_ENV=production

# Netlify에서 환경 변수 설정
# Site settings → Environment variables
```

#### **도메인 설정 문제**
```bash
# DNS 설정 확인
nslookup your-domain.com

# CNAME 레코드 설정
# your-domain.com → your-site.netlify.app
```

### 3. TypeScript 오류

#### **타입 오류 해결**
```bash
# TypeScript 컴파일 확인
npx tsc --noEmit

# 타입 정의 파일 생성
npx tsc --declaration

# 타입 체크 무시 (임시)
// @ts-ignore
```

---

## ⚙️ 고급 설정

### 1. 커스텀 도메인 설정

#### **도메인 구매 및 연결**
1. **도메인 구매** (예: GoDaddy, Namecheap)
2. **Netlify** → **Site settings** → **Domain management**
3. **Add custom domain** 클릭
4. **도메인 입력** 및 **SSL 인증서** 자동 설정

#### **DNS 설정**
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

### 2. 성능 최적화

#### **Next.js 최적화**
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}
```

#### **Netlify 최적화**
```toml
# netlify.toml
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. 보안 설정

#### **보안 헤더 설정**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

### 4. 모니터링 설정

#### **Netlify Analytics**
1. **Site settings** → **Analytics**
2. **Enable Analytics** 클릭
3. **트래픽 및 성능** 모니터링

#### **GitHub Actions 모니터링**
```yaml
# .github/workflows/monitor.yml
name: Monitor Deployment

on:
  deployment_status:

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Notify on failure
      if: failure()
      run: echo "Deployment failed!"
```

---

## 📚 유용한 명령어 모음

### **Git 명령어**
```bash
# 상태 확인
git status
git log --oneline
git branch -a

# 변경사항 되돌리기
git reset --hard HEAD
git checkout -- filename

# 원격 저장소 관리
git remote -v
git remote add origin URL
git remote remove origin
```

### **Netlify 명령어**
```bash
# 로그인
netlify login

# 사이트 목록
netlify sites:list

# 배포 상태 확인
netlify status

# 로그 확인
netlify logs
```

### **NPM 명령어**
```bash
# 의존성 설치
npm install
npm ci

# 빌드 및 실행
npm run build
npm run start
npm run dev

# 패키지 관리
npm update
npm audit
npm audit fix
```

---

## 🎯 체크리스트

### **배포 전 확인사항**
- [ ] Git 저장소에 코드 푸시 완료
- [ ] 로컬에서 빌드 성공 확인
- [ ] 환경 변수 설정 완료
- [ ] TypeScript 오류 없음
- [ ] 테스트 통과

### **배포 후 확인사항**
- [ ] 사이트 정상 접속
- [ ] 모든 기능 동작 확인
- [ ] 모바일 반응형 확인
- [ ] 성능 최적화 확인
- [ ] 보안 설정 확인

---

## 📞 지원 및 문의

### **GitHub 관련**
- **GitHub Docs**: https://docs.github.com
- **Git 튜토리얼**: https://git-scm.com/docs

### **Netlify 관련**
- **Netlify Docs**: https://docs.netlify.com
- **Netlify Community**: https://community.netlify.com

### **Next.js 관련**
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

---

**🎉 성공적인 배포를 위해 이 가이드를 단계별로 따라해보세요!**
