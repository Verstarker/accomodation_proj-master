$('document').ready(function ($) {

    // Accomodation List
    var accomodations = null;

    // Selected Accomodation
    var selectedAccomodation = null;

    // Amount Of Days
    var amountOfDays = null;

    // Selected Services
    var selectedServices = [];

    // Service Total
    var serviceTotal = null;

    // Total Price of stay
    var totalPrice = null;

    // DOM Elements

    var mainSearch = $('.main-search'),
        bgImg = $('.bg-img'),
        searchHolder = $('.search-holder'),
        searchResults = $('.search-results'),
        filterSubmit = $('.filter-submit'),
        accomoDetails = $('.accomo-details--box'),
        closebtn = $('.closebtn'),
        searchButton = $('.search-button');

    function init() {
        $.getJSON("json/accomodations.json", function (data) {
            accomodations = data.accomodations;
        });
        todaysDate();
        searchButton.on('click', function () {
            mainSearch.animate({
                top: '80%'
            }, 500);
            bgImg.animate({
                bottom: '65%',
            }, {
                    queue: false,
                    duration: 500
                });
            searchHolder.animate({
                'margin-top': '374px'
            }, 500);
            setTimeout(function () {
                searchHolder.css("display", "block");
            }, 500);
            var accomodation = getAccomodationByLocation($(this).val());
            if (accomodation) {
                displayAccomodations([accomodations]);
            } else {
                getAccomodationByLocation($(this).val());
            }
        });

        filterSubmit.on('click', function (evt) {
            getAccomodationByFilter($(this).val());
        });

        closebtn.on('click', function () {
            closeNav();
        });
        todaysDate();
    }

    function todaysDate() {
        moment.locale();

        var s = moment().format('MMMM Do YYYY'),
            today = new Date();
        t = new Date();

        t.setDate(today.getDate() + 1);
        tomorrow = moment(t).format('MMMM Do YYYY');
    }

    function getAccomodationByLocation(location) {
        var filteredAccomodations = [];
        $.each(accomodations, function (i, accomodation) {
            if (accomodation.location.includes(location)) {
                filteredAccomodations.push(accomodation);
            }
        });
        calculateDays(filteredAccomodations);
        displayAccomodations(filteredAccomodations);
    }

    function calculateDays(filteredAccomodation) {
        var startDate = $('.checkin-date').datepicker('getDate'),
            endDate = $('.checkout-date').datepicker('getDate');
        var oneDay = 24 * 60 * 60 * 1000;
        if (startDate && endDate) {
            amountOfDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (oneDay)));
        }
        return amountOfDays;
    }

    function getAccomodationByFilter(type, amountOfDays, price, noOfGuests) {
        var filteredAccomodations = [],
            noOfGuests = $('.no-of-guests').val(),
            price = $('.accomo-price').val();
        $.each(accomodations, function (i, accomodation) {
            if (accomodation.type.includes(type) && (accomodation.rangeOfNights.includes(amountOfDays)) && (accomodation.price.includes(price)) && (accomodation.noOfGuests.includes(noOfGuests))) {
                filteredAccomodations.push(accomodation);
            }
        });
        displayAccomodations(filteredAccomodations);
    }


    function getHTMLAccomodationItem(accomodation) {
        return `<div data-id="${accomodation.name}" class="accomo-list--item">
                <div class="row">
                    <div class="column column-3">
                        <img src="${accomodation.images[0]}">
                    </div>
                    <div class="column column-4">
                        <div class="accomo-item--detail">
                            <h2><a href="#">${accomodation.name}</a></h2>
                            <p>${accomodation.location}</p>
                            <p>Ph: ${accomodation.phone}</p>
                        </div>
                    </div>
                    <div class="column column-5">
                        <div class="accomo-item--detail">
                            <h3>Price</h3>
                            <h4>$${accomodation.price}</h4>
                            <span>/ Per Night</span>
                            <button data-name="${accomodation.name}" class="accomo-details--button">View Details</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    /* Set the width of the side navigation to 950px and the left margin of the page content to 950px and add a black background color to body */
    function openNav() {
        document.getElementById("mySidenav").style.width = "50%";
        document.getElementById("main").style.marginLeft = "50%";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        document.body.style.overflowX = "hidden";
        document.getElementById("search-holder").style.zIndex = "-1";
        mainSearch.animate({
            left: '25%'
        }, 500);
    }

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.body.style.backgroundColor = "white";
        document.body.style.overflowX = "scroll";
        document.getElementById("search-holder").style.zIndex = "1";
        mainSearch.animate({
            left: '50%'
        }, 500);
    }

    function displayAccomodations(accomodations) {
        var s = '';
        $.each(accomodations, function (i, accomodation) {
            s += getHTMLAccomodationItem(accomodation);
        });
        // Set inner HTML of search results container with items
        searchResults.html(s);

        var detailButtons = $('.accomo-details--button');
        $.each(detailButtons, function (i, detailButton) {
            $(this).on('click', function () {
                openNav();
                setAccomodation($(this));
            });
        });
    }

    function setAccomodation(accomodation) {
        var clickedAccomo = accomodation.data('name');
        $(accomodations).each(function (i, accomodation) {
            if (this.name === clickedAccomo) {
                selectedAccomodation = this;
                displayAccomodationDetails(selectedAccomodation);
            }
        });
    }

    function getHTMLAccomodationDetails(accomodation) {
        return `<div data-id="${accomodation.name}" class="holder">
                <div class="row">
                    <div class="column column-6">
                        <h2>${accomodation.name}</h2>
                        <p>${accomodation.location}</p>
                        <p>Ph: ${accomodation.phone}</p>
                    </div><!-- / column -->
                    <div class="column column-6">
                        <h2>$${accomodation.price}</h2>
                        <h3>Per Night</h3>
                    </div><!-- / column -->
                </div><!-- / row -->
                <div class="row">
                    <div class="column column-8">
                        <div class="image-carousel">
                            <div class="swiper-container gallery-top swiper-container-horizontal">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide"><img src="${accomodation.images[0]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[1]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[2]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[3]}"></div>
                                </div><!-- / swiper wrapper -->
                                <div class="swiper-button-prev"></div>
                                <div class="swiper-button-next"></div>
                            </div><!-- / swiper container -->
                            <div class="swiper-container gallery-thumbs swiper-container-horizontal">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide"><img src="${accomodation.images[0]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[1]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[2]}"></div>
                                    <div class="swiper-slide"><img src="${accomodation.images[3]}"></div>
                                </div><!-- / swiper wrapper -->
                            </div>
                        </div><!-- / image carousel -->
                    </div>
                    <div class="column column-4">
                        <div class="services">
                            <h2>Services</h2>
                            <div class="services-container">
                                <p>TEXT HERE</p>
                            </div><!-- / services container -->
                        <button class="book-now">Book Now</button>
                        </div><!-- / services -->
                    </div><!-- / column -->
                </div><!-- / row -->

                <div class="row">
                    <div class="price-total">
                    </div><!-- / price total -->
                </div><!-- / row -->

            </div><!-- / holder -->`;
    }

    function displayAccomodationDetails(accomodation) {
        var s = '';
        s = getHTMLAccomodationDetails(accomodation);
        accomoDetails.html(s);
        displayServices(accomodation);
        closebtn.on('click', function () {
            closeNav();
        });
        var bookNow = $('.book-now');
        var services = accomodation.services;
        bookNow.on('click', function () {
            calculateServiceTotal(services);
            calculateQuote(accomodation);
        });
    }

    function getHTMLServices(service) {
        var servicePrice = '';
        if(service.price == 0){
            servicePrice = "Free";
        } else {
            servicePrice = "$" + service.price;
        }
        return `<div data-id="${service.name}" class="service">
                    <span class="${service.icon}"></span><h4>${service.name} = ` + servicePrice + `</h4>
                    <span class="mdi tick mdi-check"></span>
                </div>`;
    }

    function displayServices(accomodation) {
        var s = '',
            selected = $('.selected');
        $.each(accomodation.services, function (i, service) {
            s += getHTMLServices(service);
        });
        var servicesContainer = $('.services-container');
        servicesContainer.html(s);
        var serviceBox = $('.service');
        $.each(accomodation.services, function(i, service){
            $(this).on('click', function () {
                $(this).toggleClass("selected");
                selectedServices.push(service);
            });
        })
    }

    function calculateServiceTotal(services) {
        var servicesContainer = $('.service'),
            s = '';
        $.each(services, function(i, service){
            selectedServices.push(services);
        })
    }

    function getHTMLPriceTotal(accomodation) {
        return `<div class="column column-6">
                    <div class="individual-costs">
                        <p>Accomodation Price for ` + amountOfDays + ` nights = ` + totalPrice + `</p>
                        <p>Services Price = $${accomodation.price}</p>
                    </div><!-- / individual costs -->
                </div><!-- / column -->
                <div class="column column-6">
                    <div class="total-costs">
                        <h2>Total Cost = $` + totalPrice + `</h2>
                    </div><!-- / total costs -->
                </div><!-- / column -->`;
    }

    function calculateQuote(accomodation) {
        var s = '';
        price = accomodation.price;
        serviceTotal = '';
        totalPrice = (price * amountOfDays)/* + serviceTotal */;
        console.log(totalPrice);
        s += getHTMLPriceTotal(accomodation);
        var priceBox = $('.price-total')
        priceBox.html(s);
    }

    init();

});