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
		// 添加是否启用快捷Git命令设置
		new Setting(gitGroup)
			.setName('是否启用快捷Git命令')
			.setDesc('启用后可以在插件中快速执行Git命令')
			.setClass("pkd-setting-item")
			.addToggle(toggle => toggle
				.setValue(this.plugin.git_setting.enableQuickCommands)
				.onChange(async (value) => {
					this.plugin.git_setting.enableQuickCommands = value;
					await this.plugin.saveGitSetting();
				}));

// 添加默认提交消息设置
		new Setting(gitGroup)
			.setName('默认提交消息')
			.setDesc('设置默认的提交消息')
			.setClass("pkd-setting-item")
			.addText(text => text
				.setPlaceholder('默认提交消息')
				.setValue(this.plugin.git_setting.defaultCommitMessage)
				.onChange(async (value) => {
					this.plugin.git_setting.defaultCommitMessage = value;
					await this.plugin.saveGitSetting();
				}));

// 添加是否启用关闭编辑器时自动提交设置
		new Setting(gitGroup)
			.setName('是否启用关闭编辑器时自动提交')
			.setDesc('启用后，关闭编辑器时会自动提交更改')
			.setClass("pkd-setting-item")
			.addToggle(toggle => toggle
				.setValue(this.plugin.git_setting.autoCommitOnClose)
				.onChange(async (value) => {
					this.plugin.git_setting.autoCommitOnClose = value;
					await this.plugin.saveGitSetting();
				}));
	}
}
