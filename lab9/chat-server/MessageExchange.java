import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

public class MessageExchange {

    private JSONParser jsonParser = new JSONParser();

    public String getToken(int index) {
        Integer number = index * 8 + 11;
        return "TN" + number + "EN";
    }

    public int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public String getServerResponse(List<MessageInfo> messages) {
        JSONObject jsonObject = new JSONObject();
        JSONArray ArrayMessages = new JSONArray();
        for(int i = 0; i < messages.size(); i++) {
            JSONObject elementOfArray = new JSONObject();
            elementOfArray.put("id", messages.get(i).getId());
            elementOfArray.put("date", messages.get(i).getDate());
            elementOfArray.put("username", messages.get(i).getUser());
            elementOfArray.put("text", messages.get(i).getMessage());
            ArrayMessages.add(elementOfArray);
        }
        jsonObject.put("messages", ArrayMessages);
        jsonObject.put("token", getToken(messages.size()));
        return jsonObject.toJSONString();
    }

    public String getClientSendMessageRequest(String idDateUserMessage) throws ParseException{
        JSONObject jsonObject = getJSONObject(idDateUserMessage);
        return jsonObject.toJSONString();
    }

    public JSONObject getClientMessage(InputStream inputStream) throws ParseException {
        JSONObject jsonObject =  getJSONObject(inputStreamToString(inputStream));
        return jsonObject;
    }

    public JSONObject getRequestBody(InputStream inputStream) throws ParseException {
        JSONObject jsonObject = getJSONObject(inputStreamToString(inputStream));
        return jsonObject;
    }

    public JSONObject getJSONObject(String json) throws ParseException {
        return (JSONObject) jsonParser.parse(json.trim());
    }

    public String getErrorMessage(String text) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("error", text);
        return jsonObject.toJSONString();
    }

    public String inputStreamToString(InputStream in) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        try {
            while ((length = in.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new String(baos.toByteArray());
    }
}
