import { App, Modal } from "obsidian";
export class CommitMessage extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.setText("Look at me, I'm a modals! 👀");
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
