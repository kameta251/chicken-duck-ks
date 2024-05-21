const Fs=require("fs"),FsExtra=require("fs-extra"),Path=require("path"),Electron=require("electron"),cfg=require("./cfg"),Msg=require("./msg.js"),Profile=require("../core/Profile");var BMPlugin=null;module.exports={style:Fs.readFileSync(Path.join(__dirname,"index.css"),"utf8"),template:Fs.readFileSync(Path.join(__dirname,"index.html"),"utf8"),$:{app:"#app"},ready:function(){require("./item/item.js");const e=require("../lib/vue.min.js");BMPlugin=new e({el:this.$.app,created(){this._initPlugin(),this.$root.$on(Msg.OnLog,e=>{this._addLog(e)}),this.$root.$on(Msg.OnCharDel,this.delCharCfg)},data:{isLoadCfgProject:!0,uuid:null,logs:[],fileSavePath:null,fileSaveName:null,fileImportPath:null,charDataArray:[],cfgArray:[]},methods:{isShowDropTips(){return this.charDataArray&&0===this.charDataArray.length},onCfgSelectChange(e,t,a){e.currentTarget.value},onBtnClickTest(){let e=Path.join(Profile.ProjectPath,"packages/bitmap-font/panel/index.js"),t=Path.join(Profile.ProjectPath,"packages/bitmap-font/panel/index.min.js");if(!Fs.existsSync(e))return void this._addLog("文件不存在: "+e);let a=Fs.readFileSync(e,"utf-8"),i=require("uglify-es").minify(a);i.error?this._addLog("生成压缩代码失败"):(this._addLog(i.code),Fs.writeFileSync(t,i.code))},_addLog(e){let t=new Date;this.logs+="["+t.toLocaleString()+"]: "+e+"\n",this.$nextTick(()=>{let e=this.$refs.log;e&&(e.scrollTop=e.scrollHeight)})},onBtnClickDelAllCharCfg(){0===Electron.remote.dialog.showMessageBoxSync({type:"question",title:"提示",message:"确定删除所有?",buttons:["确定","取消"],defaultId:0,noLink:!0,cancelId:1})&&this.delAllCharCfg()},delAllCharCfg(){this.charDataArray.splice(0,this.charDataArray.length),cfg.saveConfig(),this._addLog("清空配置成功!")},delCharCfg(e){if(!e)return void this._addLog("删除失败");let t=!1;for(let a=0;a<this.charDataArray.length;a++){let i=this.charDataArray[a];i.image===e.image&&i.width===e.width&&i.height===e.height&&(this.charDataArray.splice(a,1),this._addLog("删除: "+i.image),t=!0)}t&&cfg.saveConfig()},_initPlugin(){let e=cfg.initCfg();e&&(this.fileSaveName=e.saveName,this.fileImportPath=e.saveImport,this.charDataArray=e.bitMapCfg||[],this.charDataArray.sort((e,t)=>{let a=e.image,i=t.image,r=Path.basename(a),h=Path.basename(i);return r.charCodeAt(0)-h.charCodeAt(0)}),this._initFileSaveDir())},_initFileSaveDir(){let e=Path.join(Profile.ProjectPath,"out/bitmap-font");FsExtra.ensureDirSync(e),this.fileSavePath=e},onClickOpen(){const{openDirectory:e}=require("../util.js");e(this.fileSavePath)},onUpdateSaveName(e){if(this.fileSaveName=e.target.value,this.fileSaveName){if(0===this.fileSaveName.length)return void this._addLog("保存文件名不能为空");if(new RegExp('^[^\\\\\\/:*?\\"<>|]+$').test(this.fileSaveName)){if(-1!==this.fileSaveName.indexOf(".")){let e=this.fileSaveName.split(".");this._addLog(this.fileSaveName+"不需要包含扩展名,已经自动修改为:"+e[0]),this.fileSaveName=e[0]}cfg.setSaveName(this.fileSaveName)}else this._addLog("文件名不符合规则:"+this.fileSaveName),this.fileSaveName=""}else this._addLog("文件名无效!")},onSelectImportPath(){let e=Editor.Dialog.select({title:"选择导出目录",defaultPath:Profile.ProjectPath,properties:["openDirectory"]});if(-1!==e){let t=e[0],a=Editor.assetdb.remote.fspathToUrl(t);-1===a.indexOf("db://")?(this._addLog("不是项目资源目录:"+t),this.fileImportPath=""):(this.fileImportPath=a,cfg.setSaveImport(a))}},onGenAndImportFont(){Editor.assetdb.queryInfoByUuid(this.uuid,(e,t)=>{if(e)this._addLog(e);else{let e=t.path,a=Path.dirname(e),i=Path.basename(e,".fnt");this.onGen(i,()=>{this._addLog("导入bitmap-font到项目!");let e=Editor.assetdb.remote.fspathToUrl(a);setTimeout(()=>{this.onImport(i,e)},500)})}})},onImportFont(){this.onImport(this.fileSaveName,this.fileImportPath)},onImport(e,t){if(!t)return void this._addLog("导出目录错误:"+t);let a=Path.join(this.fileSavePath,e+".png");if(!Fs.existsSync(a))return void this._addLog("fnt图片文件不存在:"+a);let i=Path.join(this.fileSavePath,e+".fnt");if(!Fs.existsSync(i))return void this._addLog("fnt字体文件不存在:"+i);Editor.assetdb.import([a,i],t,!0,(e,a)=>{this._addLog("导入成功!"),Editor.assetdb.refresh(t),a.forEach((e,t,a)=>{})})},onGen(e,t){if(!this.fileSavePath||!Fs.existsSync(this.fileSavePath))return void this._addLog("文件保存目录不存在: "+this.fileSavePath);let a=this._checkAllCharValueIsSet();if(a)return void this._addLog("该图片没有设置字符: "+a.image);if(this.charDataArray.length<=0)return void this._addLog("请导入图片!");let i=require("../core/GenBmFont.js");i.checkAllCharIsSameHeight(this.charDataArray)||this._addLog("发现所有字符图片的高度不一致,可能会影响游戏的效果,推荐使用相同高度的字符图片"),this._addLog("生成中..."),i.gen(this.charDataArray,{path:this.fileSavePath,name:e,padding:2},a=>{a?this._addLog(`生成[${e}]失败: ${a.msg}`):(this._addLog(`生成[${e}]成功: ${this.fileSavePath}`),t&&t())})},onClickGen(){this.onGen(this.fileSaveName)},_checkAllCharValueIsSet(){for(let e=0;e<this.charDataArray.length;e++){let t=this.charDataArray[e];if(null===t.char)return t;if(""===t.char)return t}return null},_setCharData(e,t){require("util");let a=null;for(let t=0;t<this.charDataArray.length;t++){let i=this.charDataArray[t];if(i.image===e){a=i.char;break}}if(a&&1===a.length){let e=a.charCodeAt(0),i=t.x,r=t.y,h=t.width;return`char id=${e}   x=${i}    y=${r}     width=${h}    height=${t.height}    xoffset=0     yoffset=0     xadvance=${h}    page=0  chnl=15\n`}return this._addLog("没有发现字符"),null},drop(e){e.preventDefault();try{let t=[],a=e.dataTransfer.files;for(let e=0;e<a.length;e++){let i=a[e];t.push({id:null,name:i.name,type:i.type,path:i.path})}if(t&&t.length>0){let e=!1,a=!1;for(let i=0;i<t.length;i++){let r=t[i],h=r.type;if("texture"!==h)"image/png"!==h?this._addLog(`不支持的类型:${h}`):(this._dealDropFile(r.path),e=!0);else{this._addLog(`[BM-Font] 不推荐使用资源管理中的位图资源[${r.name}]`);let t=Editor.remote.assetdb.uuidToFspath(r.id);this._dealDropFile(t),e=!0,a=!0}}a&&this._addLog("[BM-Font] 建议把位图资源存放在项目外部, 再使用该工具制作."),e&&(cfg.saveConfig(),this.$nextTick(()=>{this.$root.$emit("OnDropChars")}))}}catch(e){this._addLog("当前使用的creator版本不支持从资源管理器拖拽, 请联系开发者.")}return!1},_dealDropFile(e){if(this._isSameFileExist(e))this._addLog("已经存在该图片: "+e);else{let t=Path.basename(e,Path.extname(e))[0]||null;this._addImage(e,t)}},_addImage(e,t){let a=require("image-size")(e),i={image:e,char:t,width:a.width,height:a.height};this.charDataArray.push(i),this.charDataArray.sort((e,t)=>{let a=e.image,i=t.image,r=Path.basename(a).toLowerCase(),h=Path.basename(i).toLowerCase(),s=r.length>h.length?h.length:r.length,l=0;for(let e=0;e<s;e++)if(r.charCodeAt(e)!==h.charCodeAt(e)){l=e;break}return r.charCodeAt(l)-h.charCodeAt(l)}),cfg.setBitmapCfg(this.charDataArray)},_isSameFileExist(e){let t=!1;for(let a=0;a<this.charDataArray.length;a++)if(this.charDataArray[a].image===e){t=!0;break}return t},dragOver(e){e.preventDefault(),e.stopPropagation()},dragEnter(e){e.preventDefault(),e.stopPropagation()},dragLeave(e){e.preventDefault()}}})},methods:{onLog(e){BMPlugin&&BMPlugin._addLog(e)},onClickDelAllChar(e,t){BMPlugin&&BMPlugin.delAllCharCfg(t)}}};