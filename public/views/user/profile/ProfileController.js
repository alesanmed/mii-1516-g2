'use strict'

angular.module('acme_supermarket').registerCtrl('ProfileCtrl', ['$scope', '$http', '$translate', 'ngToast',
function ($scope, $http, $translate, ngToast) {


	$http.get('/api/myprofile').then(function success(customer){
		$scope.user = customer.data;
		if ($scope.user._type.toLowerCase()=='customer') {
			$http.get('/api/mycreditcard').then(function success(cc){
				$scope.credit_card = cc.data;
			}, function error(cc) {});
		}
	},
	function error(customer) { });

	$scope.showEdition = function (){
		$scope.testForm.$show();
	}

	//Sends the server the product edition request
	$scope.updateUser = function(field, data) {
		return $http.post('/api/user/updateUser',
			{
				id: $scope.user.id,
				field: field,
				data: data
			});
	}

	$scope.changePassword = function(){
		$scope.wrongPwd = false;
		$http.post('/api/user/changePassword',
			{
				id: $scope.user.id,
				oldPass: $scope.user.oldPassword,
				newPass: $scope.user.newPassword
			}).
		then(function success(response) {
			$scope.user.oldPassword = "";
			$scope.user.newPassword = "";
			$scope.user.repeatPassword = "";
			$scope.changePasswordForm.$setPristine();
			$translate(['Profile.PwdOk']).then(function (translation) {
				ngToast.create({
					className: 'success',
					content: translation['Profile.PwdOk']
				});
			});
		}, function error(response) {
			switch(response.status) {
				case 403:
					$scope.wrongPwd = true;
					break;
				case 503:
					$translate(['Profile.ServerPwdErr']).then(function (translation) {
						ngToast.create({
							className: 'danger',
							content: translation['Profile.ServerPwdErr']
						});
					});
					break;
			}
		});
	}

	$scope.updateCC = function(){
		$scope.wrongPwd = false;
		$http.post('/api/customer/updateCC',
			{
				customer_id : $scope.user.id,
				id_cc : $scope.user.credit_card,
				cc : $scope.new_credit_card
			}).
		then(function success(response) {
			$scope.showCCForm = false;
			$scope.credit_card = $scope.new_credit_card;
			$scope.new_credit_card = "";
			$scope.updateCCForm.$setPristine();
			$translate(['Profile.CCOk']).then(function (translation) {
				ngToast.create({
					className: 'success',
					content: translation['Profile.CCOk']
				});
			});
		}, function error(response) {
				$translate(['Profile.ServerCCErr']).then(function (translation) {
					ngToast.create({
						className: 'danger',
						content: translation['Profile.ServerCCErr']
					});
				});
		});
	};

	$scope.countries = [
		{ value: 'Afganistan', text: 'Afghanistan'},
		{ value: 'Albania', text: 'Albania'},
		{ value: 'Algeria', text: 'Algeria'},
		{ value: 'American Samoa', text: 'American Samoa'},
		{ value: 'Andorra', text: 'Andorra'},
		{ value: 'Angola', text: 'Angola'},
		{ value: 'Anguilla', text: 'Anguilla'},
		{ value: 'Antigua &amp; Barbuda', text: 'Antigua &amp; Barbuda'},
		{ value: 'Argentina', text: 'Argentina'},
		{ value: 'Armenia', text: 'Armenia'},
		{ value: 'Aruba', text: 'Aruba'},
		{ value: 'Australia', text: 'Australia'},
		{ value: 'Austria', text: 'Austria'},
		{ value: 'Azerbaijan', text: 'Azerbaijan'},
		{ value: 'Bahamas', text: 'Bahamas'},
		{ value: 'Bahrain', text: 'Bahrain'},
		{ value: 'Bangladesh', text: 'Bangladesh'},
		{ value: 'Barbados', text: 'Barbados'},
		{ value: 'Belarus', text: 'Belarus'},
		{ value: 'Belgium', text: 'Belgium'},
		{ value: 'Belize', text: 'Belize'},
		{ value: 'Benin', text: 'Benin'},
		{ value: 'Bermuda', text: 'Bermuda'},
		{ value: 'Bhutan', text: 'Bhutan'},
		{ value: 'Bolivia', text: 'Bolivia'},
		{ value: 'Bonaire', text: 'Bonaire'},
		{ value: 'Bosnia &amp; Herzegovina', text: 'Bosnia &amp; Herzegovina'},
		{ value: 'Botswana', text: 'Botswana'},
		{ value: 'Brazil', text: 'Brazil'},
		{ value: 'British Indian Ocean Ter', text: 'British Indian Ocean Ter'},
		{ value: 'Brunei', text: 'Brunei'},
		{ value: 'Bulgaria', text: 'Bulgaria'},
		{ value: 'Burkina Faso', text: 'Burkina Faso'},
		{ value: 'Burundi', text: 'Burundi'},
		{ value: 'Cambodia', text: 'Cambodia'},
		{ value: 'Cameroon', text: 'Cameroon'},
		{ value: 'Canada', text: 'Canada'},
		{ value: 'Canary Islands', text: 'Canary Islands'},
		{ value: 'Cape Verde', text: 'Cape Verde'},
		{ value: 'Cayman Islands', text: 'Cayman Islands'},
		{ value: 'Central African Republic', text: 'Central African Republic'},
		{ value: 'Chad', text: 'Chad'},
		{ value: 'Channel Islands', text: 'Channel Islands'},
		{ value: 'Chile', text: 'Chile'},
		{ value: 'China', text: 'China'},
		{ value: 'Christmas Island', text: 'Christmas Island'},
		{ value: 'Cocos Island', text: 'Cocos Island'},
		{ value: 'Colombia', text: 'Colombia'},
		{ value: 'Comoros', text: 'Comoros'},
		{ value: 'Congo', text: 'Congo'},
		{ value: 'Cook Islands', text: 'Cook Islands'},
		{ value: 'Costa Rica', text: 'Costa Rica'},
		{ value: 'Cote DIvoire', text: 'Cote D\'Ivoire'},
		{ value: 'Croatia', text: 'Croatia'},
		{ value: 'Cuba', text: 'Cuba'},
		{ value: 'Curaco', text: 'Curacao'},
		{ value: 'Cyprus', text: 'Cyprus'},
		{ value: 'Czech Republic', text: 'Czech Republic'},
		{ value: 'Denmark', text: 'Denmark'},
		{ value: 'Djibouti', text: 'Djibouti'},
		{ value: 'Dominica', text: 'Dominica'},
		{ value: 'Dominican Republic', text: 'Dominican Republic'},
		{ value: 'East Timor', text: 'East Timor'},
		{ value: 'Ecuador', text: 'Ecuador'},
		{ value: 'Egypt', text: 'Egypt'},
		{ value: 'El Salvador', text: 'El Salvador'},
		{ value: 'Equatorial Guinea', text: 'Equatorial Guinea'},
		{ value: 'Eritrea', text: 'Eritrea'},
		{ value: 'Estonia', text: 'Estonia'},
		{ value: 'Ethiopia', text: 'Ethiopia'},
		{ value: 'Falkland Islands', text: 'Falkland Islands'},
		{ value: 'Faroe Islands', text: 'Faroe Islands'},
		{ value: 'Fiji', text: 'Fiji'},
		{ value: 'Finland', text: 'Finland'},
		{ value: 'France', text: 'France'},
		{ value: 'French Guiana', text: 'French Guiana'},
		{ value: 'French Polynesia', text: 'French Polynesia'},
		{ value: 'French Southern Ter', text: 'French Southern Ter'},
		{ value: 'Gabon', text: 'Gabon'},
		{ value: 'Gambia', text: 'Gambia'},
		{ value: 'Georgia', text: 'Georgia'},
		{ value: 'Germany', text: 'Germany'},
		{ value: 'Ghana', text: 'Ghana'},
		{ value: 'Gibraltar', text: 'Gibraltar'},
		{ value: 'Great Britain', text: 'Great Britain'},
		{ value: 'Greece', text: 'Greece'},
		{ value: 'Greenland', text: 'Greenland'},
		{ value: 'Grenada', text: 'Grenada'},
		{ value: 'Guadeloupe', text: 'Guadeloupe'},
		{ value: 'Guam', text: 'Guam'},
		{ value: 'Guatemala', text: 'Guatemala'},
		{ value: 'Guinea', text: 'Guinea'},
		{ value: 'Guyana', text: 'Guyana'},
		{ value: 'Haiti', text: 'Haiti'},
		{ value: 'Hawaii', text: 'Hawaii'},
		{ value: 'Honduras', text: 'Honduras'},
		{ value: 'Hong Kong', text: 'Hong Kong'},
		{ value: 'Hungary', text: 'Hungary'},
		{ value: 'Iceland', text: 'Iceland'},
		{ value: 'India', text: 'India'},
		{ value: 'Indonesia', text: 'Indonesia'},
		{ value: 'Iran', text: 'Iran'},
		{ value: 'Iraq', text: 'Iraq'},
		{ value: 'Ireland', text: 'Ireland'},
		{ value: 'Isle of Man', text: 'Isle of Man'},
		{ value: 'Israel', text: 'Israel'},
		{ value: 'Italy', text: 'Italy'},
		{ value: 'Jamaica', text: 'Jamaica'},
		{ value: 'Japan', text: 'Japan'},
		{ value: 'Jordan', text: 'Jordan'},
		{ value: 'Kazakhstan', text: 'Kazakhstan'},
		{ value: 'Kenya', text: 'Kenya'},
		{ value: 'Kiribati', text: 'Kiribati'},
		{ value: 'Korea North', text: 'Korea North'},
		{ value: 'Korea Sout', text: 'Korea South'},
		{ value: 'Kuwait', text: 'Kuwait'},
		{ value: 'Kyrgyzstan', text: 'Kyrgyzstan'},
		{ value: 'Laos', text: 'Laos'},
		{ value: 'Latvia', text: 'Latvia'},
		{ value: 'Lebanon', text: 'Lebanon'},
		{ value: 'Lesotho', text: 'Lesotho'},
		{ value: 'Liberia', text: 'Liberia'},
		{ value: 'Libya', text: 'Libya'},
		{ value: 'Liechtenstein', text: 'Liechtenstein'},
		{ value: 'Lithuania', text: 'Lithuania'},
		{ value: 'Luxembourg', text: 'Luxembourg'},
		{ value: 'Macau', text: 'Macau'},
		{ value: 'Macedonia', text: 'Macedonia'},
		{ value: 'Madagascar', text: 'Madagascar'},
		{ value: 'Malaysia', text: 'Malaysia'},
		{ value: 'Malawi', text: 'Malawi'},
		{ value: 'Maldives', text: 'Maldives'},
		{ value: 'Mali', text: 'Mali'},
		{ value: 'Malta', text: 'Malta'},
		{ value: 'Marshall Islands', text: 'Marshall Islands'},
		{ value: 'Martinique', text: 'Martinique'},
		{ value: 'Mauritania', text: 'Mauritania'},
		{ value: 'Mauritius', text: 'Mauritius'},
		{ value: 'Mayotte', text: 'Mayotte'},
		{ value: 'Mexico', text: 'Mexico'},
		{ value: 'Midway Islands', text: 'Midway Islands'},
		{ value: 'Moldova', text: 'Moldova'},
		{ value: 'Monaco', text: 'Monaco'},
		{ value: 'Mongolia', text: 'Mongolia'},
		{ value: 'Montserrat', text: 'Montserrat'},
		{ value: 'Morocco', text: 'Morocco'},
		{ value: 'Mozambique', text: 'Mozambique'},
		{ value: 'Myanmar', text: 'Myanmar'},
		{ value: 'Nambia', text: 'Nambia'},
		{ value: 'Nauru', text: 'Nauru'},
		{ value: 'Nepal', text: 'Nepal'},
		{ value: 'Netherland Antilles', text: 'Netherland Antilles'},
		{ value: 'Netherlands', text: 'Netherlands (Holland, Europe)'},
		{ value: 'Nevis', text: 'Nevis'},
		{ value: 'New Caledonia', text: 'New Caledonia'},
		{ value: 'New Zealand', text: 'New Zealand'},
		{ value: 'Nicaragua', text: 'Nicaragua'},
		{ value: 'Niger', text: 'Niger'},
		{ value: 'Nigeria', text: 'Nigeria'},
		{ value: 'Niue', text: 'Niue'},
		{ value: 'Norfolk Island', text: 'Norfolk Island'},
		{ value: 'Norway', text: 'Norway'},
		{ value: 'Oman', text: 'Oman'},
		{ value: 'Pakistan', text: 'Pakistan'},
		{ value: 'Palau Island', text: 'Palau Island'},
		{ value: 'Palestine', text: 'Palestine'},
		{ value: 'Panama', text: 'Panama'},
		{ value: 'Papua New Guinea', text: 'Papua New Guinea'},
		{ value: 'Paraguay', text: 'Paraguay'},
		{ value: 'Peru', text: 'Peru'},
		{ value: 'Phillipines', text: 'Philippines'},
		{ value: 'Pitcairn Island', text: 'Pitcairn Island'},
		{ value: 'Poland', text: 'Poland'},
		{ value: 'Portugal', text: 'Portugal'},
		{ value: 'Puerto Rico', text: 'Puerto Rico'},
		{ value: 'Qatar', text: 'Qatar'},
		{ value: 'Republic of Montenegro', text: 'Republic of Montenegro'},
		{ value: 'Republic of Serbia', text: 'Republic of Serbia'},
		{ value: 'Reunion', text: 'Reunion'},
		{ value: 'Romania', text: 'Romania'},
		{ value: 'Russia', text: 'Russia'},
		{ value: 'Rwanda', text: 'Rwanda'},
		{ value: 'St Barthelemy', text: 'St Barthelemy'},
		{ value: 'St Eustatius', text: 'St Eustatius'},
		{ value: 'St Helena', text: 'St Helena'},
		{ value: 'St Kitts-Nevis', text: 'St Kitts-Nevis'},
		{ value: 'St Lucia', text: 'St Lucia'},
		{ value: 'St Maarten', text: 'St Maarten'},
		{ value: 'St Pierre &amp; Miquelon', text: 'St Pierre &amp; Miquelon'},
		{ value: 'St Vincent &amp; Grenadines', text: 'St Vincent &amp; Grenadines'},
		{ value: 'Saipan', text: 'Saipan'},
		{ value: 'Samoa', text: 'Samoa'},
		{ value: 'Samoa American', text: 'Samoa American'},
		{ value: 'San Marino', text: 'San Marino'},
		{ value: 'Sao Tome &amp; Principe', text: 'Sao Tome &amp; Principe'},
		{ value: 'Saudi Arabia', text: 'Saudi Arabia'},
		{ value: 'Senegal', text: 'Senegal'},
		{ value: 'Serbia', text: 'Serbia'},
		{ value: 'Seychelles', text: 'Seychelles'},
		{ value: 'Sierra Leone', text: 'Sierra Leone'},
		{ value: 'Singapore', text: 'Singapore'},
		{ value: 'Slovakia', text: 'Slovakia'},
		{ value: 'Slovenia', text: 'Slovenia'},
		{ value: 'Solomon Islands', text: 'Solomon Islands'},
		{ value: 'Somalia', text: 'Somalia'},
		{ value: 'South Africa', text: 'South Africa'},
		{ value: 'Spain', text: 'Spain'},
		{ value: 'Sri Lanka', text: 'Sri Lanka'},
		{ value: 'Sudan', text: 'Sudan'},
		{ value: 'Suriname', text: 'Suriname'},
		{ value: 'Swaziland', text: 'Swaziland'},
		{ value: 'Sweden', text: 'Sweden'},
		{ value: 'Switzerland', text: 'Switzerland'},
		{ value: 'Syria', text: 'Syria'},
		{ value: 'Tahiti', text: 'Tahiti'},
		{ value: 'Taiwan', text: 'Taiwan'},
		{ value: 'Tajikistan', text: 'Tajikistan'},
		{ value: 'Tanzania', text: 'Tanzania'},
		{ value: 'Thailand', text: 'Thailand'},
		{ value: 'Togo', text: 'Togo'},
		{ value: 'Tokelau', text: 'Tokelau'},
		{ value: 'Tonga', text: 'Tonga'},
		{ value: 'Trinidad &amp; Tobago', text: 'Trinidad &amp; Tobago'},
		{ value: 'Tunisia', text: 'Tunisia'},
		{ value: 'Turkey', text: 'Turkey'},
		{ value: 'Turkmenistan', text: 'Turkmenistan'},
		{ value: 'Turks &amp; Caicos Is', text: 'Turks &amp; Caicos Is'},
		{ value: 'Tuvalu', text: 'Tuvalu'},
		{ value: 'Uganda', text: 'Uganda'},
		{ value: 'Ukraine', text: 'Ukraine'},
		{ value: 'United Arab Erimates', text: 'United Arab Emirates'},
		{ value: 'United Kingdom', text: 'United Kingdom'},
		{ value: 'United States of America', text: 'United States of America'},
		{ value: 'Uraguay', text: 'Uruguay'},
		{ value: 'Uzbekistan', text: 'Uzbekistan'},
		{ value: 'Vanuatu', text: 'Vanuatu'},
		{ value: 'Vatican City State', text: 'Vatican City State'},
		{ value: 'Venezuela', text: 'Venezuela'},
		{ value: 'Vietnam', text: 'Vietnam'},
		{ value: 'Virgin Islands (Brit)', text: 'Virgin Islands (Brit)'},
		{ value: 'Virgin Islands (USA)', text: 'Virgin Islands (USA)'},
		{ value: 'Wake Island', text: 'Wake Island'},
		{ value: 'Wallis &amp; Futana Is', text: 'Wallis &amp; Futana Is'},
		{ value: 'Yemen', text: 'Yemen'},
		{ value: 'Zaire', text: 'Zaire'},
		{ value: 'Zambia', text: 'Zambia'},
		{ value: 'Zimbabwe', text: 'Zimbabwe'}
	]
}]);