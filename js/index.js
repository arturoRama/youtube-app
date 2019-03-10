let apiKey = "AIzaSyBIC5gyjeUsLe7uwrs-hspbEGbvJkIRXEE";
let sTerm;

function buildFetch(searchTerm,callback){
	$.ajax({
	url:"https://www.googleapis.com/youtube/v3/search",
	method: "GET",
	data: {key: apiKey,
		q: searchTerm,
		maxResults: 10,
		part: "snippet",
		type: "video"
		},
	dataType: "json",
	success: responseJson => callback(responseJson),
	error: err => console.log(err)
	});
}

function newPage(pagelink,callback){
	$.ajax({
		url:"https://www.googleapis.com/youtube/v3/search",
		method: "GET",
		data:{key: apiKey,
			q : sTerm,
			maxResults: 10,
			part: "snippet",
			type: "video",
			pageToken: pagelink
		},
	dataType: "json",
	success: responseJson => callback(responseJson),
	error: err => console.log(err)
	});
}

function displayResults(data){
	$('.results').html('');
	console.log(data);
	$.each(data.items, function(i,vid){
		let videoLink = `https://www.youtube.com/watch?v=${vid.id.videoId}`;
		let videoImage = vid.snippet.thumbnails.medium.url;
		let videoTitle = vid.snippet.title;

		$('.results').append(`
			
			<div class="segment">
					<a href = ${videoLink} target="_blank"> 
						<img src = ${videoImage} alt="videoThumbnail">
						<p>${videoTitle}</p>
					</a>
			</div>
			
			`);
	});



	if(data.nextPageToken)
	{
		$("#nextPage").attr("page",data.nextPageToken);
		$("#nextPage").show();
	}else
	{
		$("#nextPage").hide();
	}

	if(data.prevPageToken)
	{
		$("#previousPage").attr("page",data.prevPageToken);
		$("#previousPage").show();
	}else
	{
		$("#previousPage").hide();
	}
}

function watchForm(){
	$('.videoForm').on('submit', (event)=> {
		event.preventDefault();
		
		let videoName = $('#videoSearchBox').val();
		sTerm = videoName;
		buildFetch(videoName,displayResults);
	});
}

$('#nextPage').on('click', (event)=> {
	event.preventDefault();
	newPage($("#nextPage").attr("page"),displayResults);
});

$('#previousPage').on('click', (event)=> {
	event.preventDefault();
	newPage($('#previousPage').attr("page"),displayResults);
});

$(watchForm);