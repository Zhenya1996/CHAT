import java.util.Date;

public class MessageInfo {

    private String id;
    private String date;
    private String user;
    private String message;

    public MessageInfo(String id, String date, String user, String message) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.message = message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public String getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }
}