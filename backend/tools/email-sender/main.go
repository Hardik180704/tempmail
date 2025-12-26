package main

import (
	"fmt"
	"log"
	"net/smtp"
)

func main() {
	// Connect to the remote SMTP server.
	c, err := smtp.Dial("127.0.0.1:2525")
	if err != nil {
		log.Fatal(err)
	}
	defer c.Quit()

	emails := []struct {
		From    string
		Subject string
		Body    string
	}{
		{
			From:    "security@google.com",
			Subject: "Security Alert: New sign-in detected",
			Body:    "<h1>Security Alert</h1><p>We detected a new sign-in to your account from a Mac device.</p>",
		},
		{
			From:    "newsletter@techweekly.com",
			Subject: "This Week in Tech: AI takes over",
			Body:    "<h1>Top Stories</h1><p>Here are the top stories for this week...</p>",
		},
		{
			From:    "billing@netflix.com",
			Subject: "Your subscription renewal",
			Body:    "<h1>Invoice</h1><p>Your subscription has been renewed for another month.</p>",
		},
        {
			From:    "friend@example.com",
			Subject: "Hey, check this out!",
			Body:    "<p>Hey! Long time no see. How have you been?</p>",
		},
	}

	for _, e := range emails {
		if err := c.Mail(e.From); err != nil {
			log.Fatal(err)
		}
		if err := c.Rcpt("ryu815bo@temp-mail.dev"); err != nil {
			log.Fatal(err)
		}

		wc, err := c.Data()
		if err != nil {
			log.Fatal(err)
		}
		
		msg := fmt.Sprintf("From: %s\r\nTo: ryu815bo@temp-mail.dev\r\nSubject: %s\r\nContent-Type: text/html\r\n\r\n%s", e.From, e.Subject, e.Body)
		
		_, err = fmt.Fprintf(wc, msg)
		if err != nil {
			log.Fatal(err)
		}
		err = wc.Close()
		if err != nil {
			log.Fatal(err)
		}
        
        // Reset for next mail
        c.Reset()
	}

	fmt.Println("Batch emails sent successfully")
}
