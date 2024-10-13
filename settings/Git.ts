import PkgEasyTool from "../main";
import {App,PluginSettingTab,Setting} from "obsidian";
export interface GitSetting{
	remoteAddr : string,
	defaultCommitMessage : string
}
export const GIT_SETTING : GitSetting = {
	remoteAddr : "",
	defaultCommitMessage:"test"
}
export class GitSettingTab extends PluginSettingTab {
	plugin: PkgEasyTool;

	constructor(app: App, plugin: PkgEasyTool) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		// 自定义CSS
		const styleEle = document.createElement("style");
		styleEle.innerHTML=`
		.setting-item{
			margin-left:2em;
		}
		.group-header{
			margin-left:0 !important;
			font-weight:600;
		}
		.group-header setting-item-name{
			color:red;
		}
		.pkd-setting-item .setting-item-control input{
			width:100%;
		}
		`;
		containerEl.appendChild(styleEle)

		const gitGroup = containerEl.createDiv({ cls: 'setting-group' });
		new Setting(gitGroup)
			.setClass("group-header")
			.setName('Git相关')
		// 是否启用Git
		// new Setting(gitGroup)
		// 	.setName('Toggle')
		// 	.setDesc('是否启用Git')
		// 	.addToggle(toggle => toggle
		// 		.setValue(true)
		// 		.onChange(value => {
		// 			console.log('Toggle state:', value);
		// 		}));
		new Setting(gitGroup)
			.setName('仓库地址')
			.setDesc('远程仓库地址')
			.setClass("pkd-setting-item")
			.addText(text => text
				.setPlaceholder('默认值')
				.setValue(this.plugin.git_setting.remoteAddr)
				.onChange(async (value) => {
					this.plugin.git_setting.remoteAddr = value;
					await this.plugin.saveGitSetting();
				}));
	}
}
