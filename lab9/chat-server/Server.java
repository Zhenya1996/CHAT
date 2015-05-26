import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.parser.ParseException;
import org.json.simple.JSONObject;


import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import  java.util.Date;

public class Server implements HttpHandler {
    private List<MessageInfo> history = new ArrayList<MessageInfo>();
    private MessageExchange messageExchange = new MessageExchange();

    //private List<String> idDeletedMessages = new ArrayList<String>();
    //private List<String> editedMessages = new ArrayList<String>(); //чётные номера - индекс, нечётные - новый текст сообщения
    private short countEdited = 0;

    public static void main(String[] args) {
        if (args.length != 1)
            System.out.println("Usage: java Server port");
        else {
            try {
                System.out.println("Server is starting...");
                Integer port = Integer.parseInt(args[0]);
                HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
                System.out.println("Server started.");
                String serverHost = InetAddress.getLocalHost().getHostAddress();
                System.out.println("Get list of messages: GET http://" + serverHost + ":" + port + "/chat?token={token}");
                System.out.println("Send message: POST http://" + serverHost + ":" + port + "/chat provide body json in format {\"message\" : \"{message}\"} ");

                server.createContext("/chat", new Server());
                server.setExecutor(null);
                server.start();
            } catch (IOException e) {
                System.out.println("Error creating http server: " + e);
            }
        }
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String response = "";

        writeLog("request begin", "serverlog.txt");

        try {
            if ("GET".equals(httpExchange.getRequestMethod())) {
                response = doGet(httpExchange);
            } else if ("POST".equals(httpExchange.getRequestMethod())) {
                doPost(httpExchange);
            } else if ("DELETE".equals(httpExchange.getRequestMethod())) {
                doDelete(httpExchange);
            } else if ("PUT".equals(httpExchange.getRequestMethod())) {
                doPut(httpExchange);
            } else if ("OPTIONS".equals(httpExchange.getRequestMethod())) {
                response = "";
            } else {
                throw new Exception("Unsupported http method: " + httpExchange.getRequestMethod());
            }

            sendResponse(httpExchange, response);
            writeLog("request end\r\n", "serverlog.txt");
            return;
        } catch (Exception e) {
            response = messageExchange.getErrorMessage(e.getMessage());
            e.printStackTrace();
        }


        try {
            sendResponse(httpExchange, response);
            writeLog("request end\r\n", "serverlog.txt");
        } catch(Exception e) {
            System.out.println("Unable to send response !");
        }
    }

    private String doGet(HttpExchange httpExchange) {
        writeLog("method GET", "serverlog.txt");

        String query = httpExchange.getRequestURI().getQuery();
        if (query != null) {
            Map<String, String> map = queryToMap(query);
            String token = map.get("token");
            if (token != null && !"".equals(token)) {
                int index = messageExchange.getIndex(token);
                String response = messageExchange.getServerResponse(history.subList(index, history.size()));
                writeLog("request parameters: " + query, "serverlog.txt");
                writeLog("response: " + response, "serverlog.txt");
                return response;

            } else {
                return "Token query parameter is absent in url: " + query;
            }
        }
        return  "Absent query in url";
    }

    private void doPost(HttpExchange httpExchange) {
        writeLog("method POST", "serverlog.txt");

        try {
            JSONObject body = messageExchange.getClientMessage(httpExchange.getRequestBody());

            String id = (String)body.get("id");
            String date = (String)body.get("date");
            String user = (String)body.get("username");//user
            String message = (String)body.get("text");//message

            System.out.println("Get Message from " + user + " : " + message);
            history.add(new MessageInfo(id, date, user, message));
        } catch (ParseException e) {
            System.err.println("Invalid message in POST body: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }

    private void doDelete(HttpExchange httpExchange) {
        writeLog("method DELETE", "serverlog.txt");

        try {
            JSONObject body = messageExchange.getRequestBody(httpExchange.getRequestBody());

            //idDeletedMessages.clear();

            writeLog("request body: " + body.toJSONString(), "serverlog.txt");
            String id = (String)body.get("id");

            for(MessageInfo i : history) {
                if(i.getId().equals(id)) {
                    history.remove(i);
                    //idDeletedMessages.add(id);
                    return;
                }
            }
        } catch (ParseException e) {
            System.err.println("Invalid message in DELETE body: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }

    private void doPut(HttpExchange httpExchange) {
        writeLog("method PUT", "serverlog.txt");

        try {
            JSONObject body = messageExchange.getRequestBody(httpExchange.getRequestBody());

            writeLog("request body: " + body.toJSONString(), "serverlog.txt");
            String id = (String)body.get("id");
            String message = (String)body.get("text");

            for(MessageInfo i : history) {
                if(i.getId().equals(id)) {
                    i.setMessage(message);
                    //editedMessages.add(id);
                    return;
                }
            }
        } catch (ParseException e) {
            System.err.println("Invalid message in PUT body: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }

    private void sendResponse(HttpExchange httpExchange, String response) {
        try {
            byte[] bytes = response.getBytes();
            Headers headers = httpExchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin","*");
            if("OPTIONS".equals(httpExchange.getRequestMethod())) {
                headers.add("Access-Control-Allow-Methods","PUT, DELETE, POST, GET, OPTIONS");
            }
            httpExchange.sendResponseHeaders(200, bytes.length);

            OutputStream os = httpExchange.getResponseBody();
            os.write( bytes);
            os.flush();
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        writeLog("response sent", "serverlog.txt");
    }

    private Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<String, String>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            } else {
                result.put(pair[0], "");
            }
        }
        return result;
    }

    public void writeLog(String log, String filename) {
        try {
            FileWriter fw = new FileWriter(filename, true);
            Date date = new Date();
            fw.write(String.valueOf(date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getYear() + 1900) + " "
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()) + " " + log + "\r\n");
            fw.close();
        } catch(IOException e) {
            System.err.println("SERVER LOG ERROR:" + e.getMessage());
        }
    }
}