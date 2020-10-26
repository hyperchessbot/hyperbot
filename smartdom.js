class Section_ extends SmartdomElement_{
	constructor(props){
		super({...props, ...{tagName: "div"}})
		
		this.docs = props.docs || {}
		
		this.a(
			div().pad(10).fs(25).fwb().html(this.docs.title),
			this.docs.paragraphs.map(paragraph=>div().pad(3).mar(3).bc("#eee").html(paragraph))
		)
	}
}
function Section(props){return new Section_(props)}

class EnvVars_ extends SmartdomElement_{
	constructor(props){
		super({...props, ...{tagName: "div"}})
		
		this.docs = props.docs || {}
		
		for(let key in this.docs){
			let item = this.docs[key]
			let parts = item.split("|")
			this.docs[key] = {
				item: parts[0],
				example: (parts[1] || "")
			}
		}
		
		this.w(960).addStyle("boxShadow", "5px 5px #eee").pad(5).addStyle("paddingLeft", "10px").bc("#cdd").a(Object.entries(this.docs).map(entry=>div().w(950).fl().addStyle("marginTop", "3px").addStyle("marginBottom", "6px").addStyle("boxShadow", "5px 5px #abc").a(
            div().c("#007").fl().aic().addStyle("minWidth", "300px").pad(3).addStyle("paddingLeft", "10px").mar(1).bc("#eee").fwb().a(div().html(entry[0])),
            div().addStyle("width", "100%").pad(3).addStyle("paddingLeft", "10px").mar(1).bc("#ffe").c("#070").html(`${entry[1].item}<span style="color:#007;">${entry[1].example?" , example : ":""}</span><span style="color:#700;font-weight:bold;font-family:monospace;">${entry[1].example}</span>`)
        )))
	}
}
function EnvVars(props){return new EnvVars_(props)}
