# Blueprint <!-- omit from toc -->

이 문서에서는 tilgrass 프로젝트 설계에 대해 작성합니다.

## 목차 <!-- omit from toc -->

- [프로젝트 설명](#프로젝트-설명)
- [프로젝트 요구사항](#프로젝트-요구사항)
  - [TIL의 정의](#til의-정의)
  - [Plain Text로 부터 TIL 생성](#plain-text로-부터-til-생성)
    - [Plain Text로 작성된 TIL 예시](#plain-text로-작성된-til-예시)
  - [TIL은 영구적으로 저장되어야 한다.](#til은-영구적으로-저장되어야-한다)
  - [TIL 프론트엔드 디자인](#til-프론트엔드-디자인)

## 프로젝트 설명

매일 작성하는 TIL은 한 달이면 30개이며, 10명이 모이면 300개가 됩니다. 이 많은 데이터를 활용하여 TIL에 참여하는 사람들로 하여금
유용한 정보를 제공할 수 있지 않을가 싶어 시작된 프로젝트가 바로 tilgrass 입니다. tilgrass는 GitHub의 잔디에서 영감을 받아
이름지었습니다.

## 프로젝트 요구사항

### TIL의 정의

TIL이란 Today I Learned의 줄임말로 오늘 하루 공부한 내용을 간략하게 담고 있어야 한다.

TIL은 다음과 같은 정보를 포함하여야 한다.

```
작성자 (홍길동)
날짜 (20221204)
공부한 내용 (1. React 프로젝트 생성 및 실습 2. Javascript 딥 다이브 책 0~50 페이지)
소감 (오늘은 열심히 공부했네요. 내일도 화이팅입니다~)
관련 태그 (#react #html #css)
```

### Plain Text로 부터 TIL 생성

TIL은 Plain Text로 부터 생성 가능하여야 한다. 문자열에서 TIL을 생성할 때, 다음과 같은 규칙을 따른다.

- **첫 번째 줄**은 `TIL YYYYMMDD` 형식으로 입력한다.

  - 반드시 `TIL` 로 시작해야 한다.
  - `YYYYMMDD` 는 각 년/월/일 사이에 점(`.`)이나 슬래시(`/`), 공백(` `), 접미사(`년`, `월`, `일`)을 허용한다.

- (optional) **다음 줄** 부터 **공부한 내용**을 작성할 수 있다.

  - **공부한 내용**은 반드시 숫자와 점(`1.`, `2.`, `3.`) 또는 별표(`*`), 또는 하이픈(`-`)으로 시작해야 한다.
  - **공부한 내용**에 대해 **상세 내용**을 작성할 시 아래 줄에 이어서 작성한다.
    - **상세 내용**은 반드시 공백 두 칸(`  `)으로 시작해야 한다.
  - **공부한 내용**은 여러 개 작성할 수 있다.

- (optional) **다음 줄** 부터 **소감**을 작성할 수 있다.

  - **소감**은 특별히 접두사가 없으며 해당 라인이 **공부한 내용**으로 파싱되지 않을 시 **소감**으로 판별한다.

- (optional) **다음 줄** 부터 TIL과 관련된 **관련 태그**들을 적을 수 있다.

  - **관련 태그**는 여러 개 작성할 수 있되 한 줄에 모두 작성해야 한다.
  - **관련 태그**는 공백(` `)으로 구분한다.
  - **관련 태그**는 샵(`#`)으로 시작해야 한다.
  - **관련 태그**는 대소문자를 구분하지 않으며, 대문자 입력 시 소문자로 변환한다.
  - **관련 태그**는 공백(` `)을 사용할 수 없다. 공백이 필요할 시 하이픈(`-`)으로 대체하여 사용한다.

#### Plain Text로 작성된 TIL 예시

```
TIL 20221205
1. OO회사 코딩테스트 응시
  - 난이도는 굉장히 어려웠습니다.
2. Javascript 딥 다이브 서적 0~50페이지 공부
  - 기본적인 문법에 대해 공부

오늘 코딩테스트 응시하느라 힘들었네요... 내일부터는 다시 개인 공부 시작합니다.

#javascript #코딩테스트
```

```
TIL 20221130
* React HOC에 대한 개념 공부
* Javascript Generator에 대해 공부

#react #javascript
```

TIL을 쉴 경우 아래와 같이 작성할 수 있다.

```
TIL 20221207
저는 오늘 휴무입니다!!
내일부터 열심히 하겠습니다
```

### TIL은 영구적으로 저장되어야 한다.

TIL은 영구적으로 보존되어야 하며 과거에 작성했던 TIL을 조회할 수 있어야 한다.

이를 위해 RDBMS를 사용하며 테이블은 아래와 같이 만든다.

> Underline으로 표시된 부분은 Primary Key이다.

#### TIL (til) <!-- omit from toc -->

| <u>id</u> | date | created_at | updated_at | author |
| :-------: | :--: | :--------: | ---------- | ------ |

#### TIL 공부한 내용 (til_content) <!-- omit from toc -->

| <u>til_id</u> | <u>no</u> | title | content |
| :-----------: | :-------: | ----- | ------- |

#### TIL 관련 태그 (til_tag) <!-- omit from toc -->

| <u>til_id</u> | <u>tag_name</u> |
| :-----------: | --------------- |

#### 태그 (tag) <!-- omit from toc -->

태그는 [https://simpleicons.org](https://simpleicons.org) 또는 [https://devicon.dev/](https://devicon.dev/) 와 같은 사이트에서 목록을 가져와 사용한다.

유저가 임의로 태그를 추가하는 것도 허용한다.

| <u>name</u> |
| :---------: |

### TIL 프론트엔드 디자인

[![figma](https://img.shields.io/static/v1?label=figma&message=link&color=blue)](https://www.figma.com/file/TS7x5pyACGPixWOZTKpyl9/tilgrass?node-id=0%3A1&t=m77SHZtXECg34sun-1)

- 전체인원의 TIL 작성 현황을 잔디로 표시한다.
- 오늘 사람들이 공부한 태그를 표시한다.
- 오늘 작성된 TIL을 최근 작성한 순서로 표시한다.