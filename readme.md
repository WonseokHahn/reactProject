nodejs 랑 expressjs 설치 및 설정 방법

1. nodejs 랑 expressjs를 다운받아야함
2. 폴더를 만들고 npm init -y(기본값)으로 package.json을 만들어줌
3. 기본값인 index.js를 만들어줌
4. npm install express --save
5. expressjs.com에 들어가서 기본문서 탐색
6. scripts 부분에 start를 어느 화면에서 할건지 정해줌

몽고DB설치 및 클라우드 사용법
1. 몽고디비 Atlas 회원가입 및 클러스터 생성
2. 몽고디비 사용하기 쉽게 만들어주는 mongoose 설치 
   npm install mongoose --save

git설치
구조 : local -> staging area -> repository -> github

1. git의 명령어는 add -> commit -> push 순으로 최종적으로 hub에 넣어준다

명령어 모음
1. git init => 깃초기화
2. git status => 깃 상태보기
3. git add . => 전부 다 깃 Staging Area에 넣어놓기
4. .gitignore파일 생성 후 node_modules 기입
5. git rm --cached node_modules -r를 통해서 Staging Area에 들어간 일부 제거
6. git commit -m "" commit 메세지 기입
7. git branch 이름 , -d 이름 => 생성/제거  (복사하는거임 main을)
8. git checkout 이름 => 만든 브랜치로 변경
9. git remote add origin https://github.com/WonseokHahn/reactProject.git 로 원격과 로컬 연결
10. git push origin main 으로 진짜 원격에 데이터 넣어줌 

ssh를 통해서 통신보안 강화하는 법
1. git ssh 생성을 구글에 검색 후 하라는대로 진행 

회원가입 기능 만들 때 서버기준
1. npm install body-parser --save => 데이터를 받았을 때 해석하는 기능
