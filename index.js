const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authorRoute = require("./routes/author");
const bookRoute = require("./routes/book");

dotenv.config();
// CONNECT DB
mongoose.connect(process.env.MONGODB_URL);


const db = mongoose.connection;
db.on('error', () => { console.log("Connection ERROR") });
db.once("open", () => { console.log("=> Connected to mongodb ...") });
/**
 * db.on: 
 * Dòng này đăng ký một trình xử lý sự kiện cho sự kiện 'error' của đối tượng kết nối. 
 * Khi xảy ra lỗi trong quá trình kết nối đến cơ sở dữ liệu MongoDB, trình xử lý này sẽ được gọi. 
 * Trong trường hợp này, trình xử lý đơn giản chỉ in ra thông báo lỗi "Connection ERROR" trên console.
 * 
 * db.on(event, callback)
 * Phương thức on được sử dụng để đăng ký một trình xử lý sự kiện cho một sự kiện cụ thể của kết nối. 
 * Nó có hai tham số chính:
 * 'event': Một chuỗi biểu thị tên sự kiện cần đăng ký trình xử lý. 
 * Trong trường hợp của đoạn mã trên, hai sự kiện được sử dụng là 'error' và 'open'.
 * 'callback': Một hàm được gọi khi sự kiện xảy ra. 
 * Trong đoạn mã trên, callback chỉ đơn giản là một hàm in ra thông báo trên console.
 * Khi sự kiện được kích hoạt (ví dụ: sự kiện 'error' hoặc 'open' xảy ra), trình xử lý sự kiện (callback) được gọi để xử lý sự kiện đó.
 * 
 *  ========================================================================================================================================
 * 
 * db.once:
 * Dòng này đăng ký một trình xử lý sự kiện cho sự kiện 'open' của đối tượng kết nối. 
 * Khi kết nối thành công đến cơ sở dữ liệu MongoDB, trình xử lý này sẽ được gọi duy nhất một lần. 
 * Trong trường hợp này, trình xử lý đơn giản chỉ in ra thông báo 
 * "=> Connected to mongodb ..." trên console để cho biết rằng kết nối đã được thiết lập thành công.
 * 
 * db.once(event, callback):
 * Phương thức once tương tự như on, nhưng khác biệt ở điểm là callback chỉ được gọi một lần duy nhất cho sự kiện đã đăng ký. 
 * Sau khi callback được gọi một lần, nó sẽ không còn được gọi lại cho các lần kích hoạt sự kiện tiếp theo.
 * Điều này khác với db.on, nơi callback sẽ được gọi mỗi khi sự kiện xảy ra. 
 * Ví dụ, khi sử dụng db.on('error', callback), callback sẽ được gọi mỗi khi có lỗi xảy ra trong quá trình kết nối, 
 * trong khi db.once('open', callback) chỉ gọi callback một lần khi kết nối được thiết lập thành công.
 */

app.use(bodyParser.json({ limit: "50mb" }));
/**
 * Đoạn mã trên sử dụng một thư viện có tên là "body-parser" để phân tích và xử lý dữ liệu đầu vào trong yêu cầu HTTP.
 * Cụ thể, nó đang cấu hình body-parser để chỉ chấp nhận dữ liệu đầu vào dạng JSON và giới hạn kích thước tối đa của dữ liệu là 50MB.
 * Khi một yêu cầu HTTP gửi đến máy chủ của ứng dụng web, body-parser sẽ phân tích dữ liệu trong phần thân của yêu cầu và chuyển đổi nó thành đối tượng JavaScript sử dụng trong ứng dụng.
 * Điều này rất hữu ích khi bạn cần truy cập và sử dụng dữ liệu được gửi từ phía máy khách (client) trong mã của mình
 */
app.use(cors());
/**
 * Dòng mã trên sử dụng một thư viện được gọi là "cors" (Cross-Origin Resource Sharing) để xử lý vấn đề về chính sách cùng nguồn tài nguyên trên ứng dụng web. 
 * Khi một trang web được tải từ một nguồn (domain) và cố gắng truy cập tài nguyên từ một nguồn khác (domain khác), trình duyệt thường áp dụng các chính sách an ninh để ngăn chặn việc truy cập đó (do chính sách cùng nguồn tài nguyên). 
 * CORS giúp giải quyết vấn đề này bằng cách thêm các tiêu đề phản hồi phù hợp, cho phép truy cập từ các nguồn khác nhau.
 * Dòng mã trên đơn giản chỉ định rằng ứng dụng web sẽ sử dụng thư viện cors để xử lý yêu cầu CORS.
 * Cụ thể, nó cho phép các yêu cầu từ các nguồn khác nhau truy cập vào tài nguyên của ứng dụng.
 */
app.use(morgan("common"));
/**
 * Đoạn mã trên sử dụng một thư viện được gọi là "morgan" để ghi lại (logging) các yêu cầu HTTP và phản hồi từ máy chủ của ứng dụng web. 
 * Nó được sử dụng để ghi lại thông tin về các hoạt động diễn ra trên máy chủ, như gửi và nhận yêu cầu, để theo dõi và gỡ lỗi ứng dụng.
 * Trong dòng mã trên, morgan được cấu hình để sử dụng định dạng "common" cho ghi lại. 
 * Định dạng này thông thường bao gồm các thông tin như: địa chỉ IP của máy khách, ngày và giờ, phương thức HTTP, URL và mã trạng thái HTTP. 
 * Khi morgan được kích hoạt, thông tin này sẽ được ghi lại và xuất ra để theo dõi các hoạt động của ứng dụng web trên máy chủ.
 */


// app.get("/api", (req, res) => {
//     res.status(200).json("HELLO WORLD");
// });
/**
 * Đoạn mã trên định nghĩa một tuyến đường (route) cho phương thức HTTP GET. 
 * Khi một yêu cầu GET được gửi đến đường dẫn "/api" trên ứng dụng, hàm callback được thực thi. 
 * Hàm callback nhận hai đối số: req (yêu cầu) và res (phản hồi).
 * Trong hàm callback, chúng ta định nghĩa phản hồi trả về khi yêu cầu đến 
 * "/api". res.status(200) đặt mã trạng thái HTTP của phản hồi là 200, tức là thành công. 
 * .json("HELLO WORLD") chuyển đổi chuỗi "HELLO WORLD" thành định dạng JSON và gửi nó lại trong phần thân của phản hồi.
 */


// ROUTES
app.use("/v1/author", authorRoute);
app.use("/v1/authors", authorRoute); 
app.use("/v1/book", bookRoute);
app.use("/v1/books", bookRoute);

app.listen(8000, () => {
    console.log(">> Server is running... <<");
});
/**
 * Dòng mã trên khởi động máy chủ web và lắng nghe các yêu cầu đến port 8000. 
 * Hàm app.listen lắng nghe các yêu cầu đến máy chủ web và khi có yêu cầu, nó sẽ chuyển tiếp cho Express xử lý.
 * Trong ví dụ này, khi máy chủ web được khởi động, 
 * nó sẽ ghi ra màn hình console thông báo ">> Server is running... <<" để xác nhận rằng máy chủ đang chạy.
 * Tóm lại, đoạn mã trên định nghĩa một tuyến đường "/api" để xử lý yêu cầu GET và trả về chuỗi JSON "HELLO WORLD". 
 * Sau đó, máy chủ web được khởi động và lắng nghe yêu cầu đến cổng 8000.
 */