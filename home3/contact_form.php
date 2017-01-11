<?php
$to = 'your-email-here@mail.com'; /* Write YOUR email address here */

$name = strip_tags(trim($_POST['name'])); //sender's name
$email = strip_tags(trim($_POST['email'])); //sender's email
$website = strip_tags($_POST['website']); //sender's website
$subject = strip_tags($_POST['subject']); 
$message = strip_tags($_POST['message']);
$human = strtolower($_POST['anti-spam']); 
$callback = $_GET['callback']; 
$result['status']  = 0;

/* If e-mail is not valid show error message */
if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $email))
{
	echo $callback . "({'msg':'<p class=\"error\">Incorrect email address!<\/p>', 'status':'0'})"; exit;
}

/* Message body */
$body = "
<html>
<body>
	<table style=\"border-spacing: 20px;\">
		<tr>
			<td style=\"border-right:1px solid #bdbdbd;text-align:right;padding:0px 10px;\">Name:</td>
			<td>$name</td>
		</tr>
		<tr>
			<td style=\"border-right:1px solid #bdbdbd;text-align:right;padding:0px 10px;\">Email:</td>
			<td>$email</td>
		</tr>
		<tr>
			<td style=\"border-right:1px solid #bdbdbd;text-align:right;padding:0px 10px;\">Subject:</td>
			<td>$subject</td>
		</tr>
		<tr>
			<td style=\"border-right:1px solid #bdbdbd;text-align:right;padding:0px 10px;\">Website:</td>
			<td>$website</td>
		</tr>
		<tr>
			<td style=\"border-right:1px solid #bdbdbd;text-align:right;padding:0px 10px;\">Message:</td>
			<td>$message</td>
		</tr>
	</table>
</body>
</html>
";

/* Message Headers */
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8";
$headers .= "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Return-Path: $email\r\n";

/* Some addition checks */
if ($_POST['submit']) 
{
	if ($name != '' && $email != '') 
	{
			if (mail($to, $subject, $body, $headers)) 
			{
				$result['msg'] = '<div class="success">Thank you! Your message has been sent.</p>';
				$result['status'] = 1;
			}
			else 
			{
				$result['msg'] = '<p class="error">Something went wrong, go back and try again!</p>';
			}
	} 
	else 
	{
		$result['msg'] = '<p class="error">You need to fill in all required fields!</p>';
	}
}

/* Return in JSON */
echo $callback . '(' . json_encode($result) . ')';