$(function() {
                    function showDialog(){
                            $(".bottom_dialog").removeClass('show_dialog');
                            $("body").addClass("showEditor");
                                }
                    function removeDialog(){
                            $(".bottom_dialog").removeClass('show_dialog');
                            $("body").removeClass("showEditor");
                                }

                    




                            $(".item_detail .col-md-2 li").click(function(){

                                console.log("Correct");
                                $index=$(this).index();
                                if($index==1){
                                    console.log("haha");



                                }
                                $(this).siblings('').removeClass('active');
                                $(this).addClass('active');
                                $(".i_de_block").hide();
                                $(".i_de_block").eq($index).show();

                            });

  });

