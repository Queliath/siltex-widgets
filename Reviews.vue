<template>
    <div class="wall_module">
        <div class="bt_rows">
            <div class="bp_post" v-for="review in reviews">
                <a class="bp_thumb" href="#">
                    <img class="bp_img" :src="review.imageUrl"/>
                </a>
                <div class="bp_info">
                    <div class="bp_author_wrap">
                        <a class="bp_author" href="#">{{ review.userName }} </a>
                        <a class="bp_date" href="#">{{ new Date(review.date) }}</a>
                    </div>
                    <div class="bp_content">
                        <div class="bp_text">
                            {{ review.text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <button v-for="page in pages" v-on:click="onPageChanged(page.number)">
                {{ page.number }} <span v-if="page.number === currentPageNumber">active</span>
            </button>
        </div>
    </div>
</template>

<script>
    import reviewsService from '../services/VkBoardCommentsService';

    export default {
        name: 'Reviews',
        data: function () {
            return {
                reviews: [],
                currentPageNumber: 1,
                totalNumberOfPages: 0,
                pages: []
            }
        },
        created: function () {
            var self = this;

            reviewsService.loadComments(self.currentPageNumber).then(
                    function (jsonpResponse) {
                        console.log(jsonpResponse);

                        var response = jsonpResponse.response;
                        self.totalNumberOfPages = Math.ceil(response.count / 20);

                        for (var i = 1; i <= 3; i++) {
                            self.pages.push({
                                number: i
                            });
                        }

                        var profilesMap = new Map();
                        response.profiles.forEach(function (profile) {
                            profilesMap.set(profile.id, profile);
                        });

                        response.items.forEach(function (item) {
                            var user = profilesMap.get(item.from_id);
                            if (!user) {
                                return;
                            }

                            self.reviews.push({
                                text: item.text,
                                date: item.date,
                                userName: user.first_name + ' ' + user.last_name,
                                imageUrl: user.photo_50
                            });
                        });
                    });
        },
        methods: {
            onPageChanged: function (pageNumber) {
                var self = this;

                self.currentPageNumber = pageNumber;

                reviewsService.loadComments(self.currentPageNumber).then(
                        function (jsonpResponse) {
                            var response = jsonpResponse.response;

                            var visiblePageNumbers;
                            if (self.currentPageNumber === 1) {
                                visiblePageNumbers = [1, 2, 3];
                            } else if (self.currentPageNumber === self.totalNumberOfPages) {
                                visiblePageNumbers = [
                                    self.currentPageNumber - 2,
                                    self.currentPageNumber - 1,
                                    self.currentPageNumber
                                ];
                            } else {
                                visiblePageNumbers = [
                                    self.currentPageNumber - 1,
                                    self.currentPageNumber,
                                    self.currentPageNumber + 1
                                ];
                            }
                            self.pages = [];
                            visiblePageNumbers.forEach(function (visiblePageNumber) {
                                self.pages.push({
                                    number: visiblePageNumber
                                })
                            });

                            var profilesMap = new Map();
                            response.profiles.forEach(function (profile) {
                                profilesMap.set(profile.id, profile);
                            });

                            self.reviews = [];
                            response.items.forEach(function (item) {
                                var user = profilesMap.get(item.from_id);
                                if (!user) {
                                    return;
                                }

                                self.reviews.push({
                                    text: item.text,
                                    date: item.date,
                                    userName: user.first_name + ' ' + user.last_name,
                                    imageUrl: user.photo_50
                                });
                            });
                        });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .wall_module {
        width: 795px;
        text-align: left;
    }
    .bt_rows {
        font-size: 13px;
        padding: 0 20px;
    }
    .bp_post {
        padding: 15px 0;
        margin-top: -1px;
        border: solid #e7e8ec;
        border-width: 1px 0;
    }
    .bp_thumb {
        float: left;
    }
    a {
        color: #2a5885;
        text-decoration: none;
        cursor: pointer;
    }
    .bp_thumb, .bp_img {
        width: 50px;
        height: 50px;
    }
    img {
        border: 0;
        color: transparent;
    }
    .bp_info {
        margin-left: 62px;
    }
    .bp_author_wrap {
        line-height: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .bp_author {
        font-weight: 700;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #42648b;
    }
    a.bp_date {
        color: #939393;
    }
    .bp_content {
        line-height: 19px;
        padding-top: 3px;
    }
    .bp_text {
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
    }
    .bp_img {
        border-radius: 50%;
        overflow: hidden;
    }
</style>
