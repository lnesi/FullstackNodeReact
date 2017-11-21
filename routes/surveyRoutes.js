const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
	app.get("/api/surveys/thanks", requireLogin, (req, res) => {
		res.send("Thanks for the feedback!");
	});

	app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients
				.split(",")
				.map(email => ({ email: email.trim() })),
			_user: req.user.id,
			dateSent: Date.now()
		});

		const mailer = new Mailer(survey, surveyTemplate(survey));

		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();
			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});

	app.post("/api/surveys/webhooks", (req, res) => {
		const p = new Path("/api/surveys/:surveyId/:choice");
		console.log("WEBHOOK",req.body);
		_.chain(req.body)
			.map(({ email, url }) => {
				console.log("hi",email,url)
				const match = p.test(new URL(url).pathname);
				if (match) {
					console.log("hi",match)
					return { email, ...match };
				}
			})
			.compact()
			.uniqBy("email", "survey")
			.each(({ surveyId, email, choice }) => {
				console.log(surveyId, email, choice);
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{
						$inc: { [choice]: 1 },
						$set: { "recipients.$.responded": true },
						lastResponded:new Date()
					}
				).exec();
			});
			res.send('ok');
	});
};

/*
[ { ip: '51.52.7.214',
[0]     sg_event_id: 'P5FbxFN3RuCXoC2BumLlhQ',
[0]     sg_message_id: 'XX05vULURyiT3P5r0Dv4BQ.filter0017p3iad2-21991-5A141A50-36.0',
[0]     useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
[0]     event: 'click',
[0]     url_offset: { index: 0, type: 'html' },
[0]     email: 'luis.nesi@two-uk.com',
[0]     timestamp: 1511267323,
[0]     url: 'http://localhost:3000/api/surveys/5a141a4f4e63bc192051d4a6/yes' } ]
*/