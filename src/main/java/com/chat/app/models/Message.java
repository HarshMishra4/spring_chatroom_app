package com.chat.app.models;


public class Message {
	private String name;
	private String avatar;
	private String content;
	private String time;
	
	public Message(String name, String avatar, String content, String time) {
		super();
		this.name = name;
		this.time = time;
		this.avatar = avatar;
		this.content = content;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	
}
