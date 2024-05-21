let Fs=require("fs");const FsExtra=require("fs-extra");let Path=require("path");const{debounce:debounce}=require("lodash");require("./core/index");const Profile=require("../core/Profile"),Electron=require("electron"),Util=require("../util"),Color=require("color");module.exports={style:Fs.readFileSync(Path.join(__dirname,"index.css"),"utf8"),template:Fs.readFileSync(Path.join(__dirname,"index.html"),"utf8"),$:{app:"#app"},ready:function(){let e=new(require("../lib/vue.min.js"))({el:this.$.app,profile:null,created(){const e=Profile.loadProjectCfg("bmfont-ttf.json");this.profile=e,this.saveName=e.data.saveName,this.savePath=e.data.savePath,this.space=e.data.space||1,e.data.canvasBgColor&&(this.canvasBgColor=e.data.canvasBgColor);let t=e.data.fontColor;t&&(this.font.color=t),this.font.size=e.data.fontSize||50,this.font.string=e.data.fontString||"6",this.font.file=e.data.fontFile,Fs.existsSync(this.font.file)||(this.font.file=this.profile.fontFile=null,this.profile.save()),this.texture.file=e.data.textureFile,this.texture.file&&Fs.existsSync(this.texture.file)||(this.texture.file=null,this.profile.save()),this._loadContextBlenderScript()},mounted(){FontEngine.initEngine(this.$refs.canvas),FontEngine.selectFontCB=(e=>{if(e){let t=e.string.charCodeAt(0);this.tipFont=`字符:${e.string}, ASCII:${t}, x:${e.x}, y:${e.y}, width:${e.width}, height:${e.height}`}else this.tipFont=""}),FontEngine.updateTextureCB=(()=>{this.updateTipTexture()}),this.updateFontRender(),this.font.file&&this._useFont(this.font.file),this.texture.file&&FontEngine.setTextureImageData(this.texture.file)},data:{tipFont:null,tipTexture1:null,tipTexture2:null,curUseLetter:null,commonUseLetters:[{id:1,name:"数字",letter:"0123456789"},{id:2,name:"数字标点",letter:"0123456789/*-+."}],savePath:null,saveName:"bitmap",space:5,canvasBgColor:"#999999",font:{file:null,name:"test",size:100,string:"4",color:"#00ff00"},outline:{enable:!1,color:"#000000",width:1},gradual:{enable:!1,direction:FontEngine.GradualDirection.Up2Down.value,start:"#ffffff",end:"#0000ff"},directions:FontEngine.GradualDirection,shadow:{enable:!1,offset:{x:0,y:0},color:"#ff0000",dim:1},texture:{enable:!1,file:null}},methods:{onChangeCommonUseLetter(e){let t=e.currentTarget.value;this.curUseLetter=t;let i=null;this.commonUseLetters.forEach(e=>{e.id.toString()===t.toString()&&(i=e.letter)}),i&&(this.font.string=this._filterSameLetter(i),this.updateFontRender())},onChangeShadowX(e){this.shadow.offset.x=e.target.value,this.updateFontRender()},onChangeShadowY(e){this.shadow.offset.y=e.target.value,this.updateFontRender()},onUpdateShadowColor(e){this.shadow.color=Color(e.target.value).hex(),this.updateFontRender()},onUpdateShadowDim(e){this.shadow.dim=e.target.value,this.updateFontRender()},onEnabledTexture(e){this.texture.enable=e.target.value,this.updateFontRender()},onUpdateTextureFile(e){},updateFontRender(){FontEngine.syncFonts(this.$data),FontEngine.update(),this.profile&&(this.profile.data.canvasBgColor=this.canvasBgColor,this.profile.data.fontColor=this.font.color,this.profile.data.fontFile=this.font.file,this.profile.data.fontSize=this.font.size,this.profile.data.space=this.space,this.profile.data.fontString=this.font.string,this.profile.data.textureFile=this.texture.file,this.profile.save())},onChangeBgColor(){},onChangeFontSize(){},onClickSaveFnt(e){this.saveName&&this.savePath&&(Fs.existsSync(this.savePath)||Fs.ensureDirSync(this.savePath),FontEngine.Save.genBMFont(this.$data))},onChangeText(e){this.font.string=e.target.value,this._debounceText.apply(this)},_debounceText:debounce(()=>{e.updateText()},1e3),onEnabledOutline(e){this.outline.enable=e.target.value,this.updateFontRender()},onUpdateOutlineWidth(e){this.outline.width=e.target.value,this.updateFontRender()},onUpdateOutlineColor(e){this.outline.color=Color(e.target.value).hex(),this.updateFontRender()},onEnabledGradual(e){this.gradual.enable=e.target.value,this.updateFontRender()},onUpdateGradualDirection(e){this.gradual.direction=e.target.value,this.updateFontRender()},onUpdateStartColor(e){this.gradual.start=Color(e.target.value).hex(),this.updateFontRender()},onUpdateEndColor(e){this.gradual.end=Color(e.target.value).hex(),this.updateFontRender()},onUpdateShadow(e){this.shadow.enable=e.target.value,this.updateFontRender()},_filterSameLetter(e){let t="";for(let i=0;i<e.length;i++){let a=e[i];-1===t.indexOf(a)&&(t+=a)}return t},updateText(){this.curUseLetter=null,this.font.string=this._filterSameLetter(this.font.string),this.updateFontRender()},onClickSelectSavePath(){let e=Util.selectDirectory("选择保存路径");if(-1!==e){let t=e[0];this.savePath=t,this.profile&&(this.profile.data.savePath=t,this.profile.save())}},onClickOpenDir(){Util.openDirectory(this.savePath)},onChangeSaveName(e){this.profile&&(this.saveName=e.target.value,this.profile.data.saveName=this.saveName,this.profile.save())},onUpdateFontSpace(e){this.space=e.target.value,this.updateFontRender()},onUpdateFontSize(e){this.font.size=e.target.value,this.updateFontRender()},onUpdateFontColor(e){this.font.color=Color.rgb(e.target.value).hex(),this.updateFontRender()},onUpdateCanvasBg(e){this.canvasBgColor=Color.rgb(e.target.value).hex(),this.updateFontRender()},onClickImportTTF(){let e=Util.selectFile({title:"选择字体文件",filters:[{name:"TTF字体",extensions:["ttf","TTF"]}]});if(-1!==e){let t=e[0];this._useFont(t)}},onClickSelectTextureFile(){let e=Util.selectFile({title:"选择纹理图片",filters:[{name:"图片",extensions:["png","jpg","jpeg"]}]});if(-1!==e){let t=e[0];this._useTexture(t)}},_useTexture(e){Fs.existsSync(e)&&(this.texture.file=e,this.profile&&(this.profile.data.textureFile=e,this.profile.save(),FontEngine.setTextureImageData(e),this.updateTipTexture()))},updateTipTexture(){let e=this.texture.file;if(Fs.existsSync(e)){let t=require("image-size")(e),i=FontEngine.getMaxFontSize();this.tipTexture1=`材质图片尺寸:${t.width}x${t.height}`,this.tipTexture2=`建议尺寸:${i.width}x${i.height}`}else this.tipTexture1=this.tipTexture2=""},_useFont(e){if(this._checkFontFileSize(e)){this.font.file=e,this.profile&&(this.profile.data.fontFile=e,this.profile.save());let t=Path.basename(e,Path.extname(e)),i=Fs.readFileSync(e),a=`${require("crypto").createHash("md5").update(i).digest("hex")}-${t}`;this.font.name=a,FontEngine.useFont({name:a,url:e})}else Editor.Dialog.info("使用的字体文件不能大于30M")},_checkFontFileSize:e=>!(Fs.statSync(e).size>=31457280),drop(e){e.preventDefault();let t=e.dataTransfer.files;if(t&&t.length>0){let e=t[0];e.path.endsWith(".ttf")||e.path.endsWith(".TTF")?this._useFont(e.path):e.path.endsWith(".png")||e.path.endsWith(".jpg")||e.path.endsWith(".jpeg")?this._useTexture(e.path):Editor.Dialog.info({type:"warning",buttons:["OK"],title:"设置错误",message:`不支持的文件类型:${e.name}`,noLink:!0})}},_tetMSDFBmfont(){require("msdf-bmfont")(ttfFile,{charset:"0123456789",fieldType:"sdf"},(e,t,i)=>{if(e)throw e;t.forEach((e,t)=>{i.pages.push(`sheet${t}.png`);let a=Path.join(Editor.Project.path,"out",`sheet${t}.png`);FsExtra.ensureFileSync(a),Fs.writeFileSync(a,e)});let a=Path.join(Editor.Project.path,"out","font.json");FsExtra.ensureFileSync(a),Fs.writeFileSync(a,JSON.stringify(i,null,4))})},dragOver(e){e.preventDefault(),e.stopPropagation()},dragEnter(e){e.preventDefault(),e.stopPropagation()},dragLeave(e){e.preventDefault()},_loadContextBlenderScript(){let e=document.createElement("script");e.setAttribute("type","text/javascript");let t=Path.join(__dirname,"../core/context_blender.js");e.setAttribute("src",t),e.onload=function(){this.parentNode.removeChild(this)},document.body.appendChild(e)}}})}};