function mdify(content){
	let parts = content.split("|")
	if(parts.length == 2){
		content = `${parts[0]} , example : \`${parts[1]}\``
	}
	return content
}

function Section(docs){
	return `## ${docs.title}\n${docs.paragraphs.map(paragraph=>`${paragraph}`).join("  \n  \n")}`	
}

function EnvVars(docs){
	return `${Object.entries(docs).map(entry=>`**${entry[0]}** ${mdify(entry[1])}`).join('  \n  \n')}`
}

module.exports = {
	Section: Section,
	EnvVars: EnvVars
}
