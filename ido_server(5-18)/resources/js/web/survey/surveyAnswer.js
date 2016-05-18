//순위형타입
function inputRank(button ,idx){
	//idx : 중질문의 갯수에 맞춰서 값이 변함. 버튼을 클릭시 idx값은 증감한다. 중질문의 숫자를 기준으로
	//index : 중질문 내의 답변의 수 **아래 each function은 유저의 답변값들을 조회해서 가져오는 function이다.
	//button : next인지 finish인지로 구분한다. 마지막 값일경우 결과화면을 유저에게 보여주자.
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx+1)).val();
	$('div.contsDiv'+(idx+1)).children().children().each(function(index, val){
		var ob = new Object();	
		ob.typeId = 'survey_answer_T'+surveyTypeId+'_A'+index;
		ob.answer = $('input[name="rank_sub_input'+(idx+1)+'"]').eq(index).val();
		jsonArray.push(ob);
	});
	var json ={"answer":jsonArray,"surveyType":"rank"}
	if(button == 'next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(){
				clickCount = 0;
			}
		})
	}else if(button =='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				console.log(data);
				var rank = data.rank;
				var select = data.select;
				var surveyTitleHtml ='<div class="surveyResult">'+
											'<div class="top_container">'+
												'<div class="result_container"></div><br>'+
											'</div>'+
										'</div>'
				$('div[id*=dialog-survey]').append(surveyTitleHtml);

				console.log(rank);
				for(i in rank){
					if(i % 2 == 0){
						$('.top_container').after('<div class="hrBar"></div><br class="hrBr">'+
								 '<div class="center_container">'+
									'<div class="typeButton"></div><br>'+
									'<div class="secondTitleContainer" style="height: 60px">'+
										'<div class="secondTitleBtn"></div>'+
										'<div class="secondTitle">'+
											'<p>'+rank[i][0].SECOND_SURVEY_TITLE+'</p>'+
										'</div>'+
									'</div>'+
									'</div>'+
									'<div class="dotteBar"></div><br><br>'+
									'<div class="bottm_container">'+
										'<div class="rank1" id="'+rank[i][0].SURVEY_TYPE_ID+'">'+
											'<div class="rank1Btn"></div>'+
											'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 200px; height: 200px">'+
										'</div>'+
									'</div>');
					}else if(i%2 == 1){
						console.log(rank[i][0].SURVEY_CONTENTS_ID);
						$('#'+rank[i][0].SURVEY_TYPE_ID+'').after('<div class="rank2">'+
																	'<div class="rank2Btn"></div>'+
																	'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 200px; height: 200px">'+
																 	'</div>');
					}

				}

				var chartData = new Array();
				var chartObj = new Object();
				for(j in select){
					$('.top_container').after('<div class="hrBar"></div><br class="hrBr">'+
								 '<div class="center_container">'+
									'<div class="typeButton"></div><br>'+
									'<div class="secondTitleContainer" style="height: 60px">'+
										'<div class="secondTitleBtn"></div>'+
										'<div class="secondTitle">'+
											'<p>'+select[j][0].SECOND_SURVEY_TITLE+'</p>'+
										'</div>'+
									'</div>'+
									'</div>'+
									'<div class="dotteBar"></div><br><br>'+
									'<div class="bottms_container">'+
									'</div>');
					$('.bottms_container').append('<div id="chartdiv" style="width: 100%; height: 300px;"></div>')
					for(k in select[j]){
						var chartObj = new Object();
						console.log(select[j][k].SURVEY_CONTENTS_ID);
						chartObj.country = select[j][k].SURVEY_CONTENTS;
						chartObj.litres = select[j][k].COUNT;
						
						
						chartData.push(chartObj);
						// $('.top_container').after('<div class="hrBar"></div><br class="hrBr">'+
						// 		 '<div class="center_container">'+
						// 			'<div class="typeButton"></div><br>'+
						// 			'<div class="secondTitleContainer" style="height: 60px">'+
						// 				'<div class="secondTitleBtn"></div>'+
						// 				'<div class="secondTitle">'+
						// 					'<p>'+select[j][0].SECOND_SURVEY_TITLE+'</p>'+
						// 				'</div>'+
						// 			'</div>'+
						// 			'</div>'+
						// 			'<div class="dotteBar"></div><br><br>'+
						// 			'<div class="bottm_container">'+
						// 				'<div class="survey1" id="'+select[j][0].SURVEY_TYPE_ID+'">'+
						// 					'<div class="rank1Btn"></div>'+
						// 					'<img src="'+select[j][0].SURVEY_IMAGE_PATH+'" style="width: 200px; height: 200px">'+
						// 				'</div>'+
						// 			'</div>');
						// console.log(chartData);
					}
					console.log('-------------------------');
					console.log(chartData);
					console.log(chartData.length);
				}/*for*/
					var chart;
	            	var legend;

	            
	                // PIE CHART
	                chart = new AmCharts.AmPieChart();
	                chart.dataProvider = chartData;
	                chart.titleField = "country";
	                chart.valueField = "litres";
	                chart.outlineColor = "#FFFFFF";
	                chart.outlineAlpha = 0.8;
	                chart.outlineThickness = 2;

	                // WRITE
	                chart.write("chartdiv");

				clickCount = 0;
				$('.selectSurveyDiv').remove();
			} /*success*/
		})
	}
}


//선택형 타입
function inputSelect(button, idx){
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx+1)).val();
	$('div.contsDiv'+(idx+1)).children().children().each(function(index, val){
		var ob = new Object();	
		ob.typeId = 'survey_answer_T'+surveyTypeId+'_A'+index;
		ob.answer = $('input[name="select_sub_input'+(idx+1)+'"]').eq(index).val();
		jsonArray.push(ob);
	});
	var json ={"answer":jsonArray,"surveyType":"select"}
	if(button == 'next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(){
				clickCount = 0;
			}
		})
	}else if(button =='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				console.log(data);
				var surveyTitleHtml =+'<div class="surveyResult">'+
											'<div class="top_container">'+
												'<div class="result_container"></div><br>'+
											'</div>'+
											'<div class="hrBar"></div><br>'+
											'<div class="center_container">'+
												'<div class="typeButton"></div><br>'+
												'<div class="secondTitleContainer" style="height: 60px">'+
													'<div class="secondTitleBtn"></div>'+
													'<div class="secondTitle">'+
														'<p>Test</p></div>'+
													'</div>'+
												'</div>'+
											'</div>'+
											'<div class="dotteBar"></div><br><br>'+
											'<div class="bottm_container">'+
												'<div class="rank1">'+
													'<div class="rank1Btn"></div>'+
													'<img src="" style="width: 200px; height: 200px">'+
												'</div>'+
												'<div class="rank2">'+
													'<div class="rank2Btn"></div>'+
													'<img src="" style="width: 200px; height: 200px">'+
												'</div>'+
											'</div>'+
										'</div>'
				$('div[id*=dialog-survey]').append(surveyTitleHtml);

				var rank = data.rank;
				var select = data.select;

				for(i in rank){
					if(i % 2 == 0){
						console.log(rank[i][0].SECOND_SURVEY_TITLE);
						$('div[id*=dialog-survey]').append('<div style=float:left>1위 : '+rank[i][0].SURVEY_CONTENTS_ID+'<img class="img" src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width:200px; height:160px;"/>');
					}else if(i%2 == 1){
						$('div[id*=dialog-survey]').append('2위 : '+rank[i][0].SURVEY_CONTENTS_ID+'<img class="img" src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width:200px; height:160px;"/></div>');
						$('div[id*=dialog-survey]').append('<br><br><br>')
					}

				}

				for(j in select){
					for(k in select[j]){
						console.log(select[j][k])
					}
					console.log('-------------------------');
				}
				clickCount = 0;
				$('.selectSurveyDiv').remove();
				
			}
		})
	}
}