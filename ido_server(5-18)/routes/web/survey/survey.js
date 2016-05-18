var mysql = require('mysql');
var client = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'ido'
});


//파트너 리스트 화면
exports.p_survey = function(req, res){
	var answer = req.body.answer;
	var surveyType = req.body.surveyType;
	
	if(req.params.id == 'input_survey_answer'){
		console.log('/input_survey_answer 접속됨');
		//Rank
		switch(surveyType){
			case 'rank' :
				var surveyTypeId = answer[0].typeId.split('T')[1].split('_A')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						console.log('??? : '+result[0].SURVEY_ID);
						for(i in r){
							var rank = answer[i].answer;
							if(rank == null || rank==0){
								rank = 0;
							}
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, ?, 1, 1111, ?)',[result[0].SURVEY_ID, surveyTypeId, r[i].SURVEY_CONTENTS_ID, rank], function(e,r){
								console.log(e);
							});
						}
					});
				});
			break;
			case 'select':
				var surveyTypeId = answer[0].typeId.split('T')[1].split('_A')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						for(i in r){
							count = i;
							var select = answer[i].answer;
							if(select == null || select==0){
							}else{
								client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, ?, 4, 1111, ?)',[result[0].SURVEY_ID, surveyTypeId, r[i].SURVEY_CONTENTS_ID, select], function(e,r){
									console.log(e);
								});
							}
							//rank
						} //for
					});
				});
				break;
		}
		//Rank
		res.end();
	}else if(req.params.id == 'input_survey_answer_finish'){
		console.log('/input_survey_answer_finish 접속됨');
		switch(surveyType){
			case 'rank' :
				var surveyTypeId = answer[0].typeId.split('T')[1].split('_A')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){
					
					// 마지막으로 가져온 survey_type_id(중질문ID값)를 가지고 대질문의 값을 조회한다. 
					// 가져온 대질문의 값을 가지고 대질문에 물려있는 중질문값들을 모두 조회하기 위한 작업.
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						console.log('??? : '+result[0].SURVEY_ID);
						for(i in r){ //여기 R은 survey_contents_id값만큼 돔.
							var rank = answer[i].answer;
							if(rank == null || rank==0){
								rank = 0;
							}
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, ?, 1, 1111, ?)',[result[0].SURVEY_ID, surveyTypeId, r[i].SURVEY_CONTENTS_ID, rank], function(e,r){
								console.log(e);
							});
						}
						//결과하면 쿼리
						client.query('SELECT SURVEY_TYPE_ID, SURVEY_TYPE FROM SURVEY_ANSWER_TB WHERE SURVEY_ID = ? GROUP BY SURVEY_TYPE_ID;', [result[0].SURVEY_ID] , function(e,r){
							var array = new Array();
							var rankObj = new Object()
							var count = 0;
						
							for(i in r){
								var ob = new Object();
								var rankArray = new Array(); //랭킹 담는곳.
								var selectArray = new Array();
								//순위형(survey_contents_tb과 조인되어있음)
								if(r[i].SURVEY_TYPE == 1){
									console.log('survey_type_id : '+r[i].SURVEY_TYPE_ID);
									client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_IMAGE_PATH, t3.SECOND_SURVEY_TITLE , COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=1 AND t1.ANSWER =1 GROUP BY t1.SURVEY_CONTENTS_ID ORDER BY COUNT DESC LIMIT 1', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_rank1_result){
										rankArray.push(survey_rank1_result);
									});
									if((parseInt(i)+1) == r.length){
										client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_IMAGE_PATH, t3.SECOND_SURVEY_TITLE , COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=1 AND t1.ANSWER =2 GROUP BY t1.SURVEY_CONTENTS_ID ORDER BY COUNT DESC LIMIT 1', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_rank2_result){
											rankArray.push(survey_rank2_result);
											ob.rank = rankArray;
											console.log(ob);
											res.json(ob);
										});
									}else{
										client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_IMAGE_PATH, t3.SECOND_SURVEY_TITLE , COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=1 AND t1.ANSWER =2 GROUP BY t1.SURVEY_CONTENTS_ID ORDER BY COUNT DESC LIMIT 1', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_rank2_result){
											rankArray.push(survey_rank2_result);
											ob.rank = rankArray;
										});
									}
								//선택형
								}else if(r[i].SURVEY_TYPE == 4){
									console.log(r[i].SURVEY_TYPE_ID);
									client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_CONTENTS, t3.SECOND_SURVEY_TITLE, COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=4 GROUP BY t1.SURVEY_CONTENTS_ID', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_select_result){
										selectArray.push(survey_select_result);
										ob.select = selectArray;
									})
								}
							}//for
						}) //결과화면 쿼리 끝
					});
				});
			break;
			case 'select':
				//TypeID
				var surveyTypeId = answer[0].typeId.split('T')[1].split('_A')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						for(i in r){
							count = i;
							var select = answer[i].answer;
							if(select == null || select==0){
							}else{
								client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, ?, 4, 1111, ?)',[result[0].SURVEY_ID, surveyTypeId, r[i].SURVEY_CONTENTS_ID, select], function(e,r){
									console.log(e);
								});
							}
							//rank
						} //for
						client.query('SELECT SURVEY_TYPE_ID, SURVEY_TYPE FROM SURVEY_ANSWER_TB WHERE SURVEY_ID = ? GROUP BY SURVEY_TYPE_ID;', [result[0].SURVEY_ID] , function(e,r){
							var array = new Array();
							var rankObj = new Object()
							var count = 0;
							for(i in r){
								var ob = new Object();
								var rankArray = new Array(); //랭킹 담는곳.
								var selectArray = new Array();
								if(r[i].SURVEY_TYPE == 1){
									//Rank(survey_contents_tb과 조인되어있음)
									console.log('survey_type_id : '+r[i].SURVEY_TYPE_ID);
									client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_IMAGE_PATH, t3.SECOND_SURVEY_TITLE , COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=1 AND t1.ANSWER =1 GROUP BY t1.SURVEY_CONTENTS_ID ORDER BY COUNT DESC LIMIT 1', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_rank1_result){
										rankArray.push(survey_rank1_result);
									});
									client.query('SELECT t1.SURVEY_CONTENTS_ID, t2.SURVEY_IMAGE_PATH, t3.SECOND_SURVEY_TITLE , COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB as t1 left join SURVEY_CONTENTS_TB as t2 on t1.survey_contents_id = t2.survey_contents_id left join SURVEY_TYPE_TB as t3 on t1.SURVEY_TYPE_ID = t3.SURVEY_TYPE_ID WHERE t1.SURVEY_ID=? AND t1.SURVEY_TYPE_ID=? AND t1.SURVEY_TYPE=1 AND t1.ANSWER =2 GROUP BY t1.SURVEY_CONTENTS_ID ORDER BY COUNT DESC LIMIT 1', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_rank2_result){
										rankArray.push(survey_rank2_result);
										ob.rank = rankArray;
									});
								}else if(r[i].SURVEY_TYPE == 4){
									console.log(r[i].SURVEY_TYPE_ID);
									//for문이 다 돌면 전송시킴.
									if((parseInt(i)+1) == r.length){
										client.query('SELECT SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB WHERE SURVEY_ID=? AND SURVEY_TYPE_ID=? AND SURVEY_TYPE=4 GROUP BY SURVEY_CONTENTS_ID', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_select_result){
											selectArray.push(survey_select_result);
											ob.select = selectArray;
											console.log(ob);
											res.json(ob)
										})
									}else{
										client.query('SELECT SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, COUNT(*) AS COUNT FROM SURVEY_ANSWER_TB WHERE SURVEY_ID=? AND SURVEY_TYPE_ID=? AND SURVEY_TYPE=4 GROUP BY SURVEY_CONTENTS_ID', [result[0].SURVEY_ID, r[i].SURVEY_TYPE_ID] , function(e,survey_select_result){
											selectArray.push(survey_select_result);
										})
									}
									
								}
							}//for
						})
						
					});
				});
		}
		
		//결과화면 전송해줘야함.
		
	}
}