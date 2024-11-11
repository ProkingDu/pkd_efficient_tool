import {
	Plugin,
	TFile,
	TAbstractFile,
	WorkspaceLeaf,
	Editor,
	MarkdownView,
	PluginSettingTab,
	Setting,
	Notice
} from 'obsidian';
//  导入依赖的类
import {CommitMessage} from './modals';
import {GIT_SETTING,GitSetting,PictureBedSetting,GitSettingTab} from "./settings";
import * as path from 'path';
import * as childProcess from 'child_process';

export default class PkgEasyTool extends Plugin {
	git_setting: GitSetting;
	async onload() {
		// 监听粘贴事件
		this.registerEvent(
			/*
			* this.app 当前插件的应用实例
			* this.app.workspace 是 Obsidian 工作区的实例。工作区管理所有的视图（如 Markdown 视图、文件浏览器视图等）和叶子节点（即工作区中的各个面板）。
			* .on 注册监听事件
			* editor-paste 监听粘贴事件
			* this.handlePaste.bind(this)  监听事件回调方法，this是实例的对象。
			* */
			this.app.workspace.on('editor-paste', this.handlePaste.bind(this))
		);
		// 加载命令
		await this.initCommand()
		// 加载设置项
		await this.loadSetting()
		// 添加设置选项卡
		this.addSettingTab(new GitSettingTab(this.app, this));
	}
	async initCommand(){
		// 添加暂存区命令
		this.addCommand({
			id:"pkg-git-add",
			name: "git add : 将更改添加到本地暂存区",
			callback:()=>{
				// 打开模态框
				new CommitMessage(this.app).open();
				this.addChange();
			}
		});

		// 提交更改命令
		this.addCommand({
			id:"pkd-git-commit",
			name: "git commit : 提交更改到本地git仓库",
			callback:()=>{
				this.commit();
			}
		});

		// 推送到远程
		this.addCommand({
			id:"pkg-git-push",
			name: "git push : 将本地更改推送到远程",
			callback:()=>{
				this.push();
			}
		});

		// 快速推送
		this.addCommand({
			id:"pkg-git-push-quickly",
			name: "git push quickly: 使用默认消息直接将本地更改提交到远程",
			callback:()=>{
				this.quickPush();
			}
		});
	}
	async onunload() {
		console.log('Image Upload Plugin unloaded');
	}

	async handlePaste(event: ClipboardEvent, leaf: WorkspaceLeaf) {
		// 检查剪贴板中是否包含文件
		if (event.clipboardData && event.clipboardData.files.length > 0) {
			const file = event.clipboardData.files[0];
			if (file.type.startsWith('image/')) {
				// 如果是图片，则阻止默认行为并处理图片粘贴
				event.preventDefault();
				const imageUrl = await this.uploadImage(file);
				console.log("img url : ", imageUrl);
				this.insertImageUrl(imageUrl, leaf);
			}
		} else {
			// 如果不是文件（例如纯文本），保留默认行为
			console.log("Pasting non-image content.");
		}
	}

	async uploadImage(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('img', file);

		const response = await fetch('https://pic.xiaodu0.com/api/files/upload', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();
			return data.url; // 假设服务器返回一个包含url的对象
		} else {
			throw new Error('Failed to upload image');
		}
	}

	async insertImageUrl(url: string, leaf: WorkspaceLeaf) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);   // Markdown视图的实例
		// @ts-ignore
		const editor = view.editor;  // Markdown 编辑器的实例
		if (editor) {  // 如果编辑器激活
			const cursor = editor.getCursor();  //
			const imageUrl = `![小杜的图床](${url})`;

			// 插入图像链接
			editor.replaceSelection(imageUrl);

			// 移动光标到插入内容的末尾
			editor.setCursor(cursor.line, cursor.ch + imageUrl.length);
		}
	}
	async addChange(){

	}
	async commit(){

	}
	async push(){

	}
	async quickPush(){
		const vaultPath = this.app.vault.getRoot().vault.adapter.basePath
		// 获取数据目录路径
		console.log(vaultPath);
		// 添加所有文件到暂存区
		childProcess.execSync('git add .', { cwd: vaultPath });

		// 提交更改
		childProcess.execSync(`git commit -m "test11"`, { cwd: vaultPath });

		// 推送到远程仓库
		childProcess.execSync('git push --force origin main', { cwd: vaultPath });

		new Notice('Git push successful!');
	}
	async loadSetting(){
		// 加载Git设置项目
		this.git_setting = Object.assign({}, GIT_SETTING, await this.loadData());
	}
	async saveGitSetting(){

	}
}
