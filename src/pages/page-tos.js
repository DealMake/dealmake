module.exports = function () {

    // That is this.
    var that = this;

    // Properties are used for reference.
    this.properties = {
        PAGE_NAME: "Terms of Service",
        PAGE_ID: "tos",
        PAGE_BACKGROUND: "#FFFFFF",
        TEXT_PADDING: 8,
        TEXT_COLOR: "#000000",
        TEXT_SIZE: 12
    };

    // The page itself.
    this.page = null;

    // Add the page to the navigation view.
    this.initiateUI = function (tab) {

        this.tab = tab;

        // Add the tab to the tabfolder.
        this.page = new tabris.Page({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }).set({
            title: this.properties.PAGE_NAME,
            background: this.properties.PAGE_BACKGROUND
        }).appendTo(this.tab.navigationView);

        // Setup a data object.
        this.page.data = {};

        // Set up a reference to this.
        this.page.data.myPage = this;

        // The scrollview and texiew for the tos.
        this.page.data.scrollView = new tabris.ScrollView({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        });
        this.page.data.textView = new tabris.TextView({
            top: that.properties.TEXT_PADDING,
            bottom: that.properties.TEXT_PADDING,
            left: that.properties.TEXT_PADDING,
            right: that.properties.TEXT_PADDING
        });
        this.page.data.textView.set({
            text: "<b>1. General</b>\n" +
                "Welcome to DealMake. By using this application (the “App”) and services (together with the App, the “Services”) offered by DealMake, you’re agreeing to these legally binding rules (the “Terms”). You’re also agreeing to the Privacy Policy and agreeing to follow any other rules on the App, like our Community Guidelines and Rules for Starting Projects.\n" +
                "We may change these terms from time to time. If we do, we’ll let you know about any material changes, either by notifying you on the App or by sending you an email. New versions of the terms will never apply retroactively — we’ll tell you the exact date they go into effect. If you keep using DealMake after a change, that means you accept the new terms.\n" +
                "DealMake is for your personal, non-commercial use, except as explained in section 4 below. \n" +
                "\n" +
                "<b>2. Registration</b>\n" +
                "You can browse DealMake without registering for an account. But to use some of DealMake’s functions, you’ll need to register, choose an account name, and set a password. When you do that, the information you give us has to be accurate and complete. Don’t impersonate anyone else or choose names that are offensive or that violate anyone’s rights. If you don’t follow these rules, we may cancel your account.\n" +
                "You’re responsible for all the activity on your account, and for keeping your password confidential. If you find out that someone’s used your account without your permission, you should report it to dealmakeshared@gmail.com\n" +
                "To sign up for an account, you need to be at least 18 years old, or old enough to form a binding contract where you live. If necessary, we may ask you for proof of age.\n" +
                "\n" +
                "<b>3. Dont's</b>\n" +
                "This section is a list of things you probably already know you shouldn’t do — lie, break laws, abuse people, steal data, hack other people’s computers, and so on. \n" +
                "We expect all users to behave responsibly and help keep this a safe place. Don’t do any of these things on the App:\n" +
                "Don’t break the law. Don’t take any action that infringes or violates other people’s rights, violates the law, or breaches any contract or legal duty you have toward anyone.\n" +
                "Don’t lie to people. Don’t post information you know is false, misleading, or inaccurate. Don’t do anything deceptive or fraudulent.\n" +
                "Don’t offer prohibited items. Don’t offer any rewards that are illegal, violate any of DealMake policies, rules, or guidelines, or violate any applicable law, statute, ordinance, or regulation.\n" +
                "Don’t victimize anyone. Don’t do anything threatening, abusive, harassing, defamatory, libelous, tortious, obscene, profane, or invasive of another person’s privacy.\n" +
                "Don’t spam. Don’t distribute unsolicited or unauthorized advertising or promotional material, or any junk mail, spam, or chain letters. Don’t run mail lists, listservs, or any kind of auto-responder or spam on or through the App.\n" +
                "Don’t harm anyone’s computer. Don’t distribute software viruses, or anything else (code, films, programs) designed to interfere with the proper function of any software, hardware, or equipment on the App (whether it belongs to DealMake or another party).\n" +
                "Don’t abuse other users’ personal information. \n" +
                "\n" +
                "We also need to make sure that the App is secure and our systems function properly. Don’t try to interfere with the proper workings of the Services.\n" +
                "Don’t bypass any measures we’ve put in place to secure the Services.\n" +
                "Don’t try to damage or get unauthorized access to any system, data, password, or other information, whether it belongs to DealMake or another party.\n" +
                "Don’t take any action that imposes an unreasonable load on our infrastructure, or on our third-party providers. (We reserve the right to determine what’s reasonable.)\n" +
                "Don’t use any kind of software or device (whether it’s manual or automated) to “crawl” or “spider” any part of the App.\n" +
                "Don’t take apart or reverse engineer any aspect of DealMake in an effort to access things like source code, underlying ideas, or algorithms.\n" +
                "\n" +
                "<b>4. How Projects Work</b>\n" +
                "\n" +
                "Most of our Terms of Use explain your relationship with DealMake. This section is different — it explains the relationship between creators and backers of DealMake projects, and who’s responsible for what. This is what you’re agreeing to when you create or back a DealMake project.\n" +
                "\n" +
                "DealMake provides a connection platform for creative projects. When a creator posts a project on DealMake, they’re inviting other people to form a contract with them. Anyone who backs a project is accepting the creator’s offer, and forming that contract.\n" +
                "DealMake is not a part of this contract — the contract is a direct legal agreement between creators and their backers. \n" +
                "DealMake is solely the connector and relationship builder between venture capitalists and investors. We provide the projects, and investors provide the money. We are not parties to the deal that may or may not be created. With that, you are on your own. But all communications prior to the deal being consummated are subject to DealMake rules and restrictions. We will do our best to keep this as a safe and interesting business portal; we hope you will do the same. \n" +
                "The creator is solely responsible for fulfilling the promises made in their project. If they’re unable to satisfy the terms of this agreement, they may be subject to legal action by backers.\n" +
                "\n" +
                "<b>6. Stuff We Don’t Do and Aren’t Responsible For</b>\n" +
                "We don’t oversee projects’ performance, and we don’t mediate disputes between users.\n" +
                "DealMake isn’t liable for any damages or losses related to your use of the Services. We don’t become involved in disputes between users, or between users and any third party relating to the use of the Services. We don’t oversee the performance or punctuality of projects, and we don’t endorse any content users submit to the App. When you use the Services, you release DealMake from claims, damages, and demands of every kind — known or unknown, suspected or unsuspected, disclosed or undisclosed — arising out of or in any way related to such disputes and the Services. All content you access through the Services is at your own risk. You’re solely responsible for any resulting damage or loss to any party.\n" +
                "\n" +
                "<b>7. Our Fees</b>\n" +
                "Fees are only charged on successfully funded projects. We charge 5%, in addition to any fees from our payments partners.\n" +
                "Creating an account on DealMake is free. If you create a project that is successfully funded, we (and our payment partners) collect fees. Our partners’ fees may vary slightly based on your location.\n" +
                "We will not collect any fees without giving you a chance to review and accept them. If our fees ever change, we’ll announce that on our App. Some funds pledged by backers are collected by payment providers. Each payment provider is its own company, and DealMake isn’t responsible for its performance.\n" +
                "You’re responsible for paying any additional fees or taxes associated with your use of DealMake.\n" +
                "\n" +
                "<b>8. Other Websites and Apps</b>\n" +
                "If you follow a link to another website or app, what happens there is between you and them — not us.\n" +
                "DealMake may contain links to other websites. (For instance, project pages, user profiles, and comments may link to other sites.) When you access third-party websites, you do so at your own risk. We don’t control or endorse those sites.\n" +
                "\n" +
                "<b>9. Your Intellectual Property</b>\n" +
                "We don’t own the stuff you post on DealMake. But when you post it, you’re giving us permission to use or copy it however we need in order to run the app, or show people what’s happening on it. (We generally just use this to promote projects and showcase our community on the app.) You’re responsible for the content you post, and you’re vouching to us that it’s all okay to use.\n" +
                "DealMake doesn’t own content you submit to us (your “Content”). But we do need certain licenses from you in order to perform our Services. When you submit a project for review, or launch a project, you agree to these terms:\n" +
                "We can use the content you’ve submitted. You grant to us, and others acting on our behalf, the worldwide, non-exclusive, perpetual, irrevocable, royalty-free, sublicensable, transferable right to use, exercise, commercialize, and exploit the copyright, publicity, trademark, and database rights with respect to your Content.\n" +
                "When we use the content, we can make changes, like editing or translating it. You grant us the right to edit, modify, reformat, excerpt, delete, or translate any of your Content.\n" +
                "You won’t submit stuff you don’t hold the copyright for (unless you have permission). Your Content will not contain third-party copyrighted material, or material that is subject to other third-party proprietary rights, unless you have permission from the rightful owner of the material, or you are otherwise legally entitled to post the material (and to grant DealMake all the license rights outlined here).\n" +
                "Any royalties or licensing on your Content are your responsibility. You will pay all royalties and other amounts owed to any person or entity based on your Content, or on DealMake’s hosting of that Content.\n" +
                "You promise that if we use your Content, we’re not violating anyone’s rights or copyrights. If DealMake or its users exploit or make use of your submission in the ways contemplated in this agreement, you promise that this will not infringe or violate the rights of any third party, including (without limitation) any privacy rights, publicity rights, copyrights, contract rights, or any other intellectual property or proprietary rights.\n" +
                "You’re responsible for the stuff you post. All information submitted to the App, whether publicly posted or privately transmitted, is the sole responsibility of the person from whom that content originated.\n" +
                "We’re not responsible for mistakes in your content. DealMake will not be liable for any errors or omissions in any content.\n" +
                "\n" +
                "<b>10. DealMake’s Intellectual Property</b>\n" +
                "The content on DealMake is protected in various ways. You do have the right to use it for certain personal purposes, but you can’t use it for anything commercial without getting permission first.\n" +
                "DealMake’s Services are legally protected by trademark (pending). You agree to respect all legal notices, information, and restrictions contained in any content accessed through the App. You also agree not to change, translate, or otherwise create derivative works of the Service.\n" +
                "DealMake grants you a license to reproduce content from the Services for personal use only. This license covers both DealMake’s own protected content and user-generated content on the App. (This license is worldwide, non-exclusive, non-sublicensable, and non-transferable.) If you want to use, reproduce, modify, distribute, or store any of this content for a commercial purpose, you need prior written permission from DealMake or the relevant copyright holder. A “commercial purpose” means you intend to use, sell, license, rent, or otherwise exploit content for commercial use, in any way.\n" +
                "\n" +
                "<b>11. How We Deal with Copyright Issues</b>\n" +
                "We comply with the Digital Millennium Copyright Act.\n" +
                "The Digital Millennium Copyright Act lays out a system of legal requirements for dealing with allegations of copyright infringement. DealMake complies with the DMCA, and we respond to notices of alleged infringement if they comply with the law. We reserve the right to delete or disable content alleged to be infringing, and to terminate accounts for repeat infringers. (We do this when appropriate and at our sole discretion.)\n" +
                "If you’d like to submit a claim of copyright infringement, please contact:\n" +
                "\n" +
                "DealMake, LLC\n" +
                "Attn: Copyright Agent\n" +  
                "604 Adams Street\n" +
                "Huntsville, AL 35801\n" +
                "dealmakeshared@gmail.com\n" +
                "\n" +
                "<b>12. Deleting Your Account</b>\n" +
                "You can delete your account at any time. Deleting your account won’t make content you’ve already posted go away.\n" +
                "You can terminate your account at any time. All provisions of this agreement survive termination of an account, including our rights regarding any content you’ve already submitted to the App. (For instance, if you’ve launched a project, deleting your account will not remove the project from the App.)\n" +
                "\n" +
                "<b>13. Our Rights</b>\n" +
                "To operate, we need to be able to maintain control over what happens on our website. So in this section, we reserve the right to make decisions to protect the health and integrity of our system. We don’t take these powers lightly, and we only use them when we absolutely have to.\n" +
                "DealMake reserves these rights:\n" +
                "We can make changes to the DealMake App and Services without notice or liability.\n" +
                "We have the right to decide who’s eligible to use DealMake. We can cancel accounts or decline to offer our Services. (Especially if you’re abusing them.) We can change our eligibility criteria at any time. If these things are prohibited by law where you live, then we revoke your right to use DealMake in that jurisdiction.\n" +
                "We have the right to cancel any pledge to any project, at any time and for any reason.\n" +
                "We have the right to reject, cancel, interrupt, remove, or suspend any project at any time and for any reason.\n" +
                "DealMake is not liable for any damages as a result of any of these actions, and it is our policy not to comment on the reasons for any such action.\n" +
                "\n" +
                "<b>14. Warranty Disclaimer</b>\n" +
                "We work hard to provide you with great services, but we can’t guarantee everything will always work perfectly. This app is presented as-is, without warranties.\n" +
                "You use our Services solely at your own risk. They are provided to you “as is” and “as available” and without warranty of any kind, express or implied.\n" +
                "DEALMAKE SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES AND CONDITIONS OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE, AND ANY WARRANTIES IMPLIED BY ANY COURSE OF DEALING, COURSE OF PERFORMANCE, OR USAGE OF TRADE. NO ADVICE OR INFORMATION (ORAL OR WRITTEN) OBTAINED BY YOU FROM DEALMAKE SHALL CREATE ANY WARRANTY.\n" +
                "\n" +
                "<b>15. Indemnification</b>\n" +
                "If you do something on DealMake that winds up getting us sued, you have to help defend us.\n" +
                "If you do something that gets us sued, or break any of the promises you make in this agreement, you agree to defend, indemnify, and hold us harmless from all liabilities, claims, and expenses (including reasonable attorneys’ fees and other legal costs) that arise from or relate to your use or misuse of DealMake. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to this indemnification clause, in which case you agree that you’ll cooperate and help us in asserting any defenses.\n" +
                "\n" +
                "<b>16. Limitation of Liability</b>\n" +
                "If something bad happens as a result of your using DealMake, we’re not liable (beyond a small amount).\n" +
                "To the fullest extent permitted by law, in no event will DealMake, its directors, employees, partners, suppliers, or content providers be liable for any indirect, incidental, punitive, consequential, special, or exemplary damages of any kind, including but not limited to damages (i) resulting from your access to, use of, or inability to access or use the Services; (ii) for any lost profits, data loss, or cost of procurement or substitute goods or services; or (iii) for any conduct of content of any third party on the App. In no event shall DealMake’s liability for direct damages be in excess of (in the aggregate) one hundred U.S. dollars ($100.00).\n" +
                "\n" +
                "<b>17. Dispute Resolution and Governing Law</b>\n" +
                "We’re located in Alabama, and any disputes with us have to be handled in Alabama under Alabama State law.\n" +
                "\n" +
                "We at DealMake encourage you to contact us if you’re having an issue, before resorting to the courts. In the unfortunate situation where legal action does arise, these Terms (and all other rules, policies, or guidelines incorporated by reference) will be governed by and construed in accordance with the laws of the State of Alabama and the United States, without giving effect to any principles of conflicts of law, and without application of the Uniform Computer Information Transaction Act or the United Nations Convention of Controls for International Sale of Goods. You agree that DealMake and its Services are deemed a passive website that does not give rise to jurisdiction over DealMake or its parents, subsidiaries, affiliates, assigns, employees, agents, directors, officers, or shareholders, either specific or general, in any jurisdiction other than the State of Alabama. You agree that any action at law or in equity arising out of or relating to these Terms, or your use or non-use of DealMake, shall be filed only in the state or federal courts located in Madison County in the State of Alabama, and you hereby consent and submit to the personal jurisdiction of these courts for the purposes of litigating any such action. You hereby irrevocably waive any right you may have to trial by jury in any dispute, action, or proceeding.\n" +
                "\n" +
                "<b>18. The Rest</b>\n" +
                "These are our official terms and our rules for how things work. (So if you ever see confusing or conflicting information about any of this stuff, just check these terms — they’re the last word.) Thanks so much for reading them, and for using DealMake!\n" +
                "These Terms and the other material referenced in them are the entire agreement between you and DealMake with respect to the Services. They supersede all other communications and proposals (whether oral, written, or electronic) between you and DealMake with respect to the Services and govern our future relationship. If any provision of these Terms is found to be invalid under the law, that provision will be limited or eliminated to the minimum extent necessary so that the Terms otherwise will remain in full force and effect and enforceable. The failure of either you or DealMake to exercise any right provided for in these Terms in any way won’t be deemed a waiver of any other rights.\n" +
                "These Terms are personal to you. You can’t assign them, transfer them, or sublicense them unless you get DealMake’s prior written consent. DealMake has the right to assign, transfer, or delegate any of its rights and obligations under these Terms without your consent. DealMake will provide you notice via email, written notice, or by conspicuously posting the notice on our App.",
            textColor: that.properties.TEXT_COLOR,
            font: that.properties.TEXT_SIZE + "px",
            markupEnabled: true
        });
        this.page.data.scrollView.append(this.page.data.textView);
        this.page.append(this.page.data.scrollView);
    };

    // Called when the page is switched to.
    this.load = function () {

    };

    // Called when the page is switched away from.
    this.unload = function () {

    };

    /*
        Custom functions
    */



};
