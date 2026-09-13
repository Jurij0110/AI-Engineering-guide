# Handoff task: hoàn thiện simulation cho các module IBM AI Engineering

> Cập nhật: 2026-09-12. Đây là trạng thái **source hiện tại**, không phải checklist tiến độ học của một tài khoản Firebase. Đọc file này trước khi sửa code. Tài liệu kế hoạch cũ `tasks/integrate-module-simulations.md` được viết trước khi tích hợp; không dùng câu “chưa triển khai” trong đó làm trạng thái hiện tại.

## 1. Mục tiêu và định nghĩa “xong”

Website là ứng dụng HTML/CSS/JavaScript ES modules chạy tĩnh trên GitHub Pages. Trang `course-library.html?id=ibm-ai-engineering` đọc cây file của repository IBM rồi hiển thị course → module → bài/tài liệu. Mục tiêu tiếp theo là tạo simulation **phù hợp với từng bài học đã được catalog đăng ký**, trong chính UI Course Library hiện có. Một module được tính hoàn tất về **coverage simulation** chỉ khi mọi bài của module trong `SIMULATION_CATALOG` có `status: "ready"`, spec/engine hợp lệ và đã được kiểm thử trên trình duyệt. Không suy luận rằng chỉ cần một simulation chung cho cả module là hoàn thành mọi bài.

Giữ nguyên điều hướng, accordion, tìm kiếm/lọc, link GitHub/Colab, checkbox tiến độ và Firebase. Không thay website bằng simulator độc lập, không tự động đánh dấu hoàn thành bài khi chạy simulation, không tạo file giả để tăng thống kê.

## 2. Snapshot coverage và điều chưa được chứng minh

Nguồn sự thật cho coverage: `assets/data/simulation-catalog.mjs`, tra cứu bằng **`libraryId + sourcePath` chính xác**. Snapshot hiện tại:

| Chỉ số | Số lượng |
| --- | ---: |
| Course | 13 |
| Module học có bài trong catalog | 47 |
| Bài trong simulation catalog | 308 |
| Bài `ready` / có specifier | 108 |
| Bài `planned` / chưa có simulation | 200 |
| Module đã phủ hết bài catalog | 18 |
| Module chưa có simulation nào | 29 |
| Module phủ một phần | 0 |
| Engine đã đăng ký | 45 |

18 module đã có đủ mapping/spec/engine, gồm Course 01 Module 1–6 (43 bài), Course 02 Module 1–5 (22 bài), và Course 03 Module 1–7 (43 bài). Toàn bộ Course 04–13 còn `planned`; hiện chưa cần triển khai cho đến khi người học đến các phần đó. Đã kiểm thử tự động qua Python suite (8/8) và Node suite (29/29). Course 03 Module 5–7 (14 bài mới) đã được QA tương tác trên Chrome: mở đúng bài, đổi preset, Reset và đồng bộ phần kết quả; không đánh dấu hoàn thành bài học. Chưa kiểm thử ghi tiến độ vào Firebase để tránh thay đổi tài khoản thật. Con số 18/47 là **coverage simulation trong catalog**, không phải tiến độ học của tài khoản hay xác nhận đã QA thủ công từng bài trong toàn bộ 108 bài.

Website có thể hiển thị **362 indexed files** và các module `Certificates`; đó là toàn bộ file repository, không phải 308 bài trong simulation catalog. Không dùng thống kê indexed files để suy ra số simulation còn thiếu.

## 3. Danh sách chính xác các module chưa làm

Trong bảng, `M` là số module trong course; `ready/total` chỉ nói về coverage simulation, **không phải** tiến độ học. ID course/module và từng `sourcePath` chính xác nằm trong manifest; tiêu đề ở đây chỉ để đọc nhanh. Tất cả 29 dòng dưới đây hiện có `0` bài `ready`.

| Course | Module chưa làm | Ready / tổng bài catalog |
| --- | --- | ---: |
| 04 Introduction to Neural Networks and PyTorch | M1 — Tensor and Datasets | 0/12 |
| 04 | M2 — Linear Regression | 0/9 |
| 04 | M3 — Linear Regression Pytorch Way | 0/8 |
| 04 | M4 — Multiple Input Output Linear Regression | 0/8 |
| 04 | M5 — Logistic Regression For Classification | 0/7 |
| 04 | M6 — Final Project | 0/2 |
| 05 Deep Learning with PyTorch | M2 — Softmax Regression | 0/4 |
| 05 | M3 — Shallow Neural Networks | 0/7 |
| 05 | M4 — Deep Neural Networks | 0/15 |
| 05 | M5 — Convolutional Neural Networks | 0/12 |
| 05 | M6 — Final Project | 0/2 |
| 06 AI Capstone Project with Deep Learning | M1 — Data Handling | 0/4 |
| 06 | M2 — CNN Model Development | 0/3 |
| 06 | M3 — CNN Vision Transformer Integration | 0/3 |
| 07 Generative AI and LLMs: Architecture & Data Preparation | M1 — Generative AI Architecture | 0/6 |
| 07 | M2 — Data Prep for LLMs | 0/5 |
| 08 Generative AI Foundational Models for NLP | M1 — Fundamentals of Language Understanding | 0/8 |
| 08 | M2 — Word2Vec and Sequence to Sequence Models | 0/10 |
| 09 Generative AI Language Modeling with Transformers | M1 — Fundamental Concepts of Transformer Architecture | 0/9 |
| 09 | M2 — Advanced Concepts of Transformer Architecture | 0/11 |
| 10 Generative AI Engineering & Fine-Tuning Transformers | M1 — Transformers and Fine Tuning | 0/8 |
| 10 | M2 — Parameter Efficient Fine-Tuning (PEFT) | 0/5 |
| 11 Advanced Fine-Tuning for LLMs | M1 — Diff Approaches to Fine Tuning | 0/6 |
| 11 | M2 — Fine Tuning Causal LLMs w Human Feedback and Direct Preference | 0/9 |
| 12 Fundamentals of AI Agents with RAG & LangChain | M1 — RAG Framework | 0/4 |
| 12 | M2 — Prompt Engineering and LangChain | 0/9 |
| 13 Project: Generative AI Applications with RAG & LangChain | M1 — Document Loader Using LangChain | 0/6 |
| 13 | M2 — RAG Using LangChain | 0/7 |
| 13 | M3 — QA Bot | 0/1 |

Tổng theo course còn thiếu: **01: 0; 02: 0; 03: 0; 04: 46; 05: 40; 06: 10; 07: 11; 08: 18; 09: 20; 10: 13; 11: 15; 12: 13; 13: 14 = 200 bài**. Course 05 bắt đầu từ M2 theo **ID nguồn**; không tự đổi thành M1. Course 04 có tên thư mục nguồn khác thường với hậu tố `.txt`; giữ nguyên `sourcePath` trong manifest. Một số filename nguồn có lỗi chính tả (ví dụ `Mulitple`); không tự “sửa đẹp” đường dẫn.

## 4. Bản đồ dự án cho agent mới

| Thành phần | Vai trò / lưu ý |
| --- | --- |
| `README.md` | Cách chạy local, Firebase, GitHub Pages, hướng dẫn mở rộng simulation. |
| `assets/data/course-libraries.js` | Cấu hình library, repository/branch, tên course. |
| `assets/data/simulation-catalog.mjs` | 308 mapping chuẩn, trạng thái `ready`/`planned`; không fuzzy-match. |
| `assets/js/course-library/app.js` | Tải GitHub tree, phân nhóm course/module, hiển thị hàng file/nút Simulation, checkbox và progress. |
| `course-library.html` + `assets/css/simulations.css` | Dialog simulation dùng chung và style scoped theo UI hiện tại. |
| `assets/js/simulations/integration.js` | Lazy import spec/engine, mount/teardown, Retry/Reset, focus, nối nút hoàn thành với host. |
| `assets/js/simulations/lesson-schema.js` | Validate cấu trúc LessonSpec tối thiểu. |
| `assets/js/simulations/engine-loaders.js`, `engine-registry.js` | Registry/lazy loader của 35 engine. |
| `assets/js/simulations/lessons/*.js` | 94 LessonSpec hiện có; mẫu tham khảo về fields/content. |
| `assets/js/simulations/engines/*.js` | Logic tương tác; mỗi engine cần `mount`, `update`, `reset`, `getAccessibleSummary`, `destroy`. |
| `assets/js/progress-store.js` | Firebase Auth/Firestore, local fallback khi chưa đăng nhập. Không tạo progress store riêng cho simulator. |
| `tests/test_simulation_integration.py`, `tests/simulation-contract.test.mjs` | Kiểm tra mapping, spec, engine và host integration. Hard-coded snapshot 94/214 phải cập nhật khi coverage tăng. |
| `assets/js/simulations/NOTICE.md` | Provenance nguồn port và cảnh báo chưa có license độc lập rõ ràng. |

Simulator gốc có ở `D:\01.AI_resource\01.IBM_course\ibm-ai-engineering\simulator` trong môi trường khảo sát; repository nguồn là `https://github.com/dylanjayabahu/ibm-ai-engineering`. Source gốc hữu ích để tham khảo engine/spec hiện có, nhưng runtime website **không được phụ thuộc ổ D:** hay server của simulator. Không copy nguyên app shell, CSS theme, localStorage progress, `/source/` route hoặc notebook runner sang host. Trước khi tái phân phối mã/tài liệu nguồn ngoài project, kiểm tra quyền sử dụng theo `NOTICE.md`.

## 5. Luồng kỹ thuật phải hiểu trước khi implement

1. `course-library.html` tải `assets/js/course-library/app.js`; app tải recursive GitHub tree theo cấu hình library.
2. `buildCourses()` gom các file thực tế theo thư mục course/module. `renderFile()` gọi `findSimulation(library.id, file.path)`. `ready` hiện nút **Simulation**, `planned` hiện nhãn **Simulation planned**, file ngoài catalog không có action.
3. Click nút mới lazy-load `integration.js`, rồi import `./lessons/<spec>.js` và engine tương ứng. `integration.js` kiểm tra `id`, `courseId`, `moduleId`, `sourcePath`, `sourceFormat`, `engine` khớp manifest. Sai mapping sẽ hiện lỗi trong dialog chứ không được bỏ qua validation.
4. Dialog dùng source link GitHub của file thật, giữ focus, đóng/Escape thì destroy engine. Controls/Reset không ghi tiến độ.
5. Chỉ action **Mark lesson complete** hoặc checkbox host mới lưu theo khóa `file.path` qua `ProgressStore('library:<library.id>', ...)`. Khi đã đăng nhập, store ghi Firestore `users/{uid}/progress/{scope}`; chưa đăng nhập thì fallback local. Không sửa khóa hay schema Firebase khi thêm simulation.

Ví dụ thêm bài `ML_Overview.txt`: tìm entry `planned` có `sourcePath` đúng; đọc nội dung nguồn để thiết kế tương tác; tạo spec `lessons/ml-overview.js` với **chính xác** 6 field định danh trong entry; dùng engine phù hợp hoặc tạo engine mới; rồi đổi đúng entry đó sang `ready` và `specifier: "./lessons/ml-overview.js"`. Không thêm entry trùng hoặc tự sinh path từ tên hiển thị.

LessonSpec tối thiểu theo schema hiện tại: `id`, `courseId`, `moduleId`, `title`, `sourcePath`, `sourceFormat` (`txt`/`md`/`ipynb`), `engine`, ít nhất 2 `learningObjectives`, `scenario.seed`, `controls`, `views`, `explanationRules`, `presets`, `challenge.prompt` + `challenge.success`, `quiz`, `accessibility.canvasSummary` + `keyboardHelp`. Xem spec gần chủ đề nhất để biết contract riêng của engine. **Không giả định** mọi engine hiểu cùng key `challenge.success`: bug Regression trước đây do spec dùng `pattern`/`degree` nhưng engine chỉ đọc `maxDegree`/`maxValidationMse`. Đối chiếu điều kiện prompt, state và metric bằng test thực tế trước khi bật `ready`.

## 6. Quy trình đề xuất cho từng module chưa làm

Ưu tiên theo thứ tự course: hoàn tất course 01 M1 trước (một bài, kiểm chứng toàn bộ quy trình), sau đó course 03 → 13 theo module. Với mỗi module, làm theo các bước sau:

- [ ] Lấy danh sách entry `planned` của đúng `courseId + moduleId` từ manifest. Đếm và ghi nhận mọi `sourcePath`, loại file và thứ tự nội dung. Đối chiếu với GitHub tree; nếu path đã đổi hoặc nguồn không truy cập được, báo rõ thay vì gắn spec sai bài.
- [ ] Đọc nội dung từng bài từ repository nguồn (file `.txt`/`.md`, notebook `.ipynb` khi là lab). Tóm tắt mục tiêu học tập, input mà người học có thể điều chỉnh, output cần quan sát và ngộ nhận cần giải thích. Không suy ra nội dung chỉ từ filename.
- [ ] Chọn engine hiện có dựa trên **năng lực thật của engine** (controls, state, metric, chart), không chỉ dựa trên tên tương tự. Nếu không đáp ứng chủ đề, thêm engine mới và loader, giữ giao diện/contract của host. Không tái sử dụng một engine để tạo simulation “có nút nhưng sai bài”.
- [ ] Tạo spec riêng cho từng bài. Mục tiêu, scenario, preset, explanation, quiz và challenge phải bám nguồn; lab phải có nhiệm vụ/benchmark tương ứng. Các preset nên thể hiện ít nhất một tình huống đạt và một tình huống chưa đạt challenge khi hợp lý. Seed giúp kết quả lặp lại.
- [ ] Kiểm tra tương tác: controls làm metric/visual thay đổi có ý nghĩa, chart đúng kích thước/màu trong CSS host, Reset về mặc định, challenge đổi đúng trạng thái, summary cho screen reader phản ánh kết quả. Kiểm tra input biên, NaN/Infinity, số mẫu lớn và cleanup khi đóng.
- [ ] Chuyển từng entry hoàn tất sang `ready`; thêm đúng specifier, engine; không đổi `libraryId + sourcePath` hoặc các ID định danh. Bài chưa hoàn tất giữ `planned` và không có nút giả.
- [ ] Cập nhật test snapshot theo số mới (ready + planned = 308), thêm kiểm thử engine/spec/challenge mới và QA browser cho tất cả bài vừa bật. Ghi số bài mới ready và bằng chứng kiểm thử trong PR/commit hoặc cập nhật task này.

Nên chia thay đổi thành từng module hoặc nhóm nhỏ có thể review. Sau mỗi nhóm, kiểm tra lại toàn bộ module trước khi gọi là “xong”; một module có 1 bài planned vẫn là chưa hoàn tất coverage.

## 7. Cách chạy và kiểm thử

Từ `D:\AI-course`:

```powershell
python -m http.server 8000
```

Mở `http://localhost:8000/course-library.html?id=ibm-ai-engineering`. Không mở HTML bằng `file://`; cần HTTP để ES modules/Firebase hoạt động. GitHub API phải tải được cây repository. Trang production là `https://jurij0110.github.io/AI-Engineering-guide/course-library.html?id=ibm-ai-engineering`; mọi import/asset phải chạy dưới subpath `/AI-Engineering-guide/`, không dùng đường dẫn absolute kiểu `/assets/...` nếu làm hỏng Pages.

```powershell
python -m unittest discover -s tests -v
node --test tests/simulation-contract.test.mjs
```

Tại snapshot này Python suite đã qua **8/8**. `node` không có trong PATH của PowerShell phiên kiểm tra này; hãy cài/bổ sung Node.js 22+ hoặc dùng môi trường có Node để chạy test JS. Trước khi báo hoàn thành nhóm bài mới, cần chạy được cả hai suite (hoặc ghi rõ vì sao JS suite chưa chạy) và kiểm tra browser thật, không chỉ test tĩnh. Test hiện tại có assert số 64/244 và course ready chỉ 01–02; phải sửa thành kỳ vọng mới **dựa trên công việc thật** sau khi thêm bài, không xóa assertions chỉ để test xanh.
Tại snapshot này Python suite đã qua **8/8** và Node suite qua **9/9**. Khi `node` chưa có trong PATH của PowerShell phiên kiểm tra, có thể dùng node portable tại `D:\01.AI_resource\01.IBM_course\ibm-ai-engineering\.worktrees\simulator-foundation\.superpowers\sdd\2026-08-22-ibm-ai-simulator-foundation\tools\node-v22.23.2-win-x64\node.exe --test tests/simulation-contract.test.mjs`. Cả hai test suite đều kiểm tra chính xác 79 ready / 229 planned và tải toàn bộ 31 engine.

Browser QA tối thiểu: trang tải; đúng bài có nút Simulation; click mở đúng title, module, source link; engine mount không lỗi; chỉnh control, preset, Reset; Challenge đúng cả đạt/chưa đạt; đóng bằng nút và Escape, focus quay về nút; mở bài khác không để engine cũ hoạt động; search/filter vẫn đúng; desktop/mobile không vỡ chart; link GitHub/Colab và checkbox không mất. Không thử ghi tiến độ vào Firebase tài khoản thật nếu chưa có dữ liệu test/ủy quyền phù hợp. Nếu test save, dùng tài khoản/dữ liệu test và xác minh reload, rollback khi lỗi.

## 8. Điều kiện bàn giao cho agent kế tiếp

- [ ] Báo rõ module nào được làm, bao nhiêu bài chuyển `planned → ready`, danh sách `sourcePath` còn thiếu; cập nhật tổng ready/planned và trạng thái module.
- [ ] Đưa bằng chứng kiểm thử: lệnh, kết quả, các engine/bài đã smoke-test trong browser, lỗi còn tồn tại.
- [ ] Giữ nguyên thay đổi chưa commit của người dùng; `git status` trước khi sửa, không reset/xóa `tasks/` hoặc sửa file ngoài phạm vi.
- [ ] Không tự commit/push/deploy nếu người dùng chỉ yêu cầu implement; phân biệt chạy local với bản đã lên GitHub Pages.
- [ ] Nếu thiếu quyền sử dụng nguồn, thiếu nội dung bài hoặc cần mở rộng Firebase schema, dừng riêng phần đó và nêu blocker; không gắn `ready` khi chưa có simulation trung thực và hoạt động.

Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại mới **64/308 bài, 10/47 module**.
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại đạt **79/308 bài, 13/47 module**.
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại đạt **86/308 bài, 14/47 module**.
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại đạt **94/308 bài, 15/47 module**.
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại đạt **101/308 bài, 16/47 module** (đã qua tự động 20/20 Node và 8/8 Python; QA tương tác trình duyệt cho 7 bài Course 03 M5 đã hoàn tất).
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; mốc trước đạt **106/308 bài, 17/47 module** (25/25 Node và 8/8 Python).
Mục tiêu cuối: **308/308 bài `ready`, 47/47 module phủ hết**, cùng kiểm thử thực tế; snapshot hiện tại đạt **108/308 bài, 18/47 module** (Course 03 có 43/43 bài; 29/29 Node và 8/8 Python; Course 03 M5–M7 đã QA tương tác trên Chrome). Tạm dừng triển khai các module còn lại theo yêu cầu người học.
