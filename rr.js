(function(global, $) {
	let professions = [
		{
			name: "Хирург",
			income: { salary: 1500, interest: 0, property: 0, bussiness: 0, passive: 0 },
			expenses: { rent: 100, food: 200, credit: { apartments: 0, car: 300, appliances: 200 }, trenings: 0, weares: 50, travel: 20, cellular: 40 },
			other: { saving: 1000 },
			rates: { perchild: 200 },
			goals: { dreamname: "", dreamcost: 0 },
		},
		{
			name: "Рекламный агент",
			income: { salary: 300, interest: 0, property: 0, bussiness: 0, passive: 0 },
			expenses: { rent: 20, food: 150, credit: { apartments: 0, car: 0, appliances: 0 }, trenings: 0, weares: 10, travel: 20, cellular: 20 },
			other: { saving: 500 },
			rates: { perchild: 70 },
			goals: { dreamname: "", dreamcost: 0 },
		},
		{
			name: "Корреспондент",
			income: { salary: 400, interest: 0, property: 0, bussiness: 0, passive: 0 },
			expenses: { rent: 30, food: 100, credit: { apartments: 0, car: 0, appliances: 0 }, trenings: 0, weares: 10, travel: 40, cellular: 40 },
			other: { saving: 100 },
			rates: { perchild: 40 },
			goals: { dreamname: "", dreamcost: 0 },
		},
		{
			name: "Рабочий-плиточник",
			income: { salary: 600, interest: 0, property: 0, bussiness: 0, passive: 0 },
			expenses: { rent: 150, food: 100, credit: { apartments: 0, car: 0, appliances: 0 }, trenings: 0, weares: 10, travel: 20, cellular: 10 },
			other: { saving: 400 },
			rates: { perchild: 60 },
			goals: { dreamname: "", dreamcost: 0 },
		},
		{
			name: "Патрульный-постовой",
			income: { salary: 150, interest: 0, property: 0, bussiness: 0, passive: 0 },
			expenses: { rent: 20, food: 70, credit: { apartments: 0, car: 0, appliances: 0 }, trenings: 0, weares: 0, travel: 0, cellular: 10 },
			other: { saving: 100 },
			rates: { perChild: 50 },
			goals: { dreamName: "", dreamCost: 0 },
		},
	]



	let professionsList;

	const game = { prof: null, property:[], smallbiz: [], largebiz: [], propertyNext: 0, smallbizNext: 0, largebizNext: 0 };

	const asint = (v) => {
		return parseInt(v) || 0;
	}

	const asintval = (j) => {
		return asint(j.val());
	}

	const race = {
		get game() {
			return game;
		},
		recalc: () => {
			$("#activeIncome").val(race.activeIncome);
			$("#passiveIncome").val(race.passiveIncome);
			$("#totalIncome").val(race.totalIncome);
			$("#totalExpenses").val(race.totalExpenses);
			const takeMoney = race.roundPayment;
			$("#roundPayment").val(takeMoney);
			$("#takeMoney").text(takeMoney);
		},
		get activeIncome() {
			return asintval($("#salary")) + asintval($("#other-income1")) + asintval($("#other-income2")) + asintval($("#other-income3"));
		},
		get passiveIncome() {
			return race.propertiesIncome + race.smallbizIncome + race.largebizIncome;
		},
		get totalIncome() {
			return race.activeIncome + race.passiveIncome;
		},
		get propertiesIncome() {
			return game.property.reduce((total, p) => {
				return total + p.income;
			}, 0);
		},
		get smallbizIncome() {
			return game.smallbiz.reduce((total, p) => {
				return total + p.income;
			}, 0);
		},
		get largebizIncome() {
			return game.largebiz.reduce((total, p) => {
				return total + p.income;
			}, 0);
		},
		get childrenPayment() {
			return asintval($("#children-count")) * asintval($("#children-pay"));
		},
		get totalExpenses() {
			return expensesFields.reduce((total, p) => {
				if (typeof p === "string")
					return total + asintval($(`#${p}`))
				else
					return total + p(); 
			}, 0);
		},
		get roundPayment() {
			return race.totalIncome - race.totalExpenses;
		},
		get creditPayment() {
			return game.property.reduce((total, p) => {
				return total + p.monthly;
			}, 0);
		},
		finishRound: () => {
			if (confirm("Деньги получено?") ) {
				const propdel = [];
				game.property.forEach((p, index) => {
					if (p.monthly) {
						p.credit -= p.monthly;
						if (p.monthly > p.credit) {
							p.monthly = p.credit;
							p.obj.find(`input[name=property-monthly-pay-${p.key}]`).val(p.monthly);
						}
							
						if (p.credit <= 0) {
							p.credit = 0;
							propdel.push({index, key: p.key});
						}
						p.obj.find(`input[name=property-credit-${p.key}]`).val(p.credit);
					}
				});
				propdel.forEach((a) => {
					game.property[a.index].obj.find(`input[name='property-hascredit-${a.key}']`).trigger('click');
					// game.property.splice(a.index, 1);
				});
			}
			race.recalc();
		}
	};

	let interface;

	// let propertyIncome = ()=>0, smallbizIncome = ()=>0, largebizIncome = () => 0, childrenPayments = () => 0, rentCredits = () => 0;

	const incomeFields = ['salary', () => race.propertyIncome, () => race.smallbizIncome, () => race.largebizIncome, 'other-income1', 'other-income2', 'other-income3'];
	const expensesFields = ['property', 'rent', 'food', 'learning', 'trennings', 'wardrobe', 'travel-gas', 'phone', () => race.childrenPayment, () => race.creditPayment, 'tutelage', 'other-expenses1', 'other-expenses2', 'other-expenses3'];

	// propertyIncome = race.propertiesIncome;
	// smallbizIncome = race.smallbizIncome;
	// childrenPayments = race.childrenPayment;
	// rentCredits = race.creditPayment;

	const strs = {property: "недвижимость", smallbiz: "малый бизнес", largebiz: "большой бизнес"}

	const multibind = (what) => () => {
		let tpl = interface.tpl[what];
		const index = game[what+"Next"];
		tpl = tpl.replace(/-#/g,`-${index}`);
		let fragment = $(tpl);
		interface.inputs[what+"List"].append(fragment);
		const object = {income: 0, credit: 0, monthly: 0, obj: fragment, key: index};
		game[what].push(object);
		fragment.find(`input[name='${what}-income-${index}']`).on('change',      (event) => { object.income  = asint(event.target.value); race.recalc(); });
		fragment.find(`input[name='${what}-credit-${index}']`).on('change',      (event) => { object.credit  = asint(event.target.value); race.recalc(); });
		fragment.find(`input[name='${what}-monthly-pay-${index}']`).on('change', (event) => { object.monthly = asint(event.target.value); race.recalc(); });

		fragment.find('button[name=removebtn]').on('click', () => {
			const whatName = fragment.find(`input[name='${what}-name-${index}']`).val();
			if ( confirm(`Удалить ${strs[what]} "${whatName}"?`) ) {
				game.property.splice(index,1);
				$(`#${what}-row-${index}`).remove();
				object.income = 0;
				object.credit = 0;
				object.monthly = 0;
				race.recalc();
				delete object;
			}
		});
		// fragment.find(`input[name='${what}-income-${index}'], input[name='${what}-credit-${index}'], input[name='${what}-monthly-pay-${index}']`)
		// 	.on('change', (event) => {
		// 		race.recalc($(event.target));
		// 	})
		fragment.find(`input[name='${what}-hascredit-${index}']`).on('change', (event) => {
			switch ($(event.target).prop('checked') ) {
				case true:
					fragment.find('input[name]').prop('disabled', false).removeClass('hidden');
					fragment.find(`input[name='${what}-credit-${index}']`).prop('disabled', false).removeClass('hidden');
					fragment.find(`input[name='${what}-monthly-pay-${index}']`).prop('disabled', false).removeClass('hidden');
					fragment.find(`.credit-break`).removeClass('hidden');
					break;
				default:
				case false:
					const creditName = fragment.find(`input[name='${what}-name-${index}']`).val();
					if (confirm(`Кредит для "${creditName}" погашен?`)) {
						fragment.find(`input[name='${what}-credit-${index}']`).val("").remove();
						fragment.find(`input[name='${what}-monthly-pay-${index}']`).val("").remove();
						fragment.find(`input[name='${what}-property-hascredit-${index}']`).parent().remove();
						object.credit = 0;
						object.monthly = 0;
						race.recalc();
						fragment.find(`.credit-enable`).remove();	
					} else {
						$(event.target).prop('checked', true);
					}
					break;
			}
		})
	};

	interface = {
		vars: {
			setupQueue: [],
			setup: {},
			selectedWorld: null
		},
		inputs: {
			professions: null,
			world: null,
			username: null,
		},
		tpl: {
			property: "",
			smallbiz: "",
			largebiz: ""
		},
		render: {
			professions: (list) => {
				interface.vars.setupQueue.push(new Promise((resolve) => { interface.vars.setup.professionSelected = resolve; } ));

				professionsList = $("#professions-list");
				list.forEach((prof, index) => {
					const profession = $(`<li class="dropdown-item" data-key="${index}">${prof.name}</li>`)
						.on('click', interface.handlers.selectProfession);
					professionsList.append(profession);
				});
				interface.inputs.professions = $("#profession-select");
				interface.inputs.professions.dropdown();
			},
			world: () => {
				interface.vars.setupQueue.push(new Promise((resolve) => { interface.vars.setup.worldSelected = resolve; } ));
				interface.inputs.world = $("#world input[name=world]");
				interface.inputs.world.on("change", interface.handlers.selectWorld);
			},
			username: () => {
				interface.vars.setupQueue.push(new Promise((resolve) => { interface.vars.setup.nameSelected = resolve; } ));
				interface.inputs.username = $("#username");
				interface.inputs.username.on("change", interface.handlers.updateUsername);
			}
		},
		actions: {
			setup: () => {
				return new Promise((resolve) => {
					interface.render.professions(professions);
					interface.render.world();
					interface.render.username();
					Promise.all(interface.vars.setupQueue)
						.then(resolve);
					// resolve();
				})
			},
			showPage: () => {
				return new Promise((resolve) => {
					interface.vars.selectedWorld.removeClass('hidden');
					interface.actions.bindall();
					resolve();
				});
			},
			startGame: () => {
				return new Promise((resolve) => {
					console.log("Game is started");
					race.recalc();
					resolve();
				});
			},
			bindall: () => {
				interface.actions.prepare();
				interface.actions.bindProperties();
				interface.actions.bindSmallbiz();
				interface.actions.bindLargebiz();

			},
			bindProperties: () => {
				$("#propertyAddBtn").on('click', multibind('property'));
				$("#smallbizAddBtn").on('click', multibind('smallbiz'));
				$("#largebizAddBtn").on('click', multibind('largebiz'));
				incomeFields.forEach((selector) => {
					if (typeof selector === "string") {
						$(`#${selector}`).on('change', () => race.recalc());
					}
				})
				expensesFields.forEach((selector) => {
					if (typeof selector === "string") {
						$(`#${selector}`).on('change', () => race.recalc());
					}
				})
				$("#children-count, #children-pay").on('change', () => {
					race.recalc();
				});
				$("#finishRound").click(() => {
					race.finishRound();
				})
			},
			bindSmallbiz: () => {
				$("#smalbizAddBtn").on('click', () => {
					let tpl = interface.tpl.smallbiz;
					const index = game.smallbiz.length;
				});
			},
			bindLargebiz: () => {

			},
			prepare: () => {
				interface.inputs.propertyList = $("#property-list");
				interface.tpl.property = $("#property-template").text();
				interface.inputs.smallbizList = $("#smallbiz-list");
				interface.tpl.smallbiz = $("#smallbiz-template").text();
				interface.inputs.largebizList = $("#largebiz-list");
				interface.tpl.largebiz = $("#largebiz-template").text();
			},
		},
		handlers: {
			selectProfession: (event) => {
				game.prof = professions[event.target.dataset.key];
				interface.inputs.professions.text(game.prof.name);
				interface.inputs.professions.prop('disabled', true);
				interface.vars.setup.professionSelected();
			},
			selectWorld: (event) => {
				interface.inputs.world.prop('disabled', true);
				interface.inputs.world.each((index, w) => {
					if (w.value !== event.target.value) {
						$(w).parent().addClass('disabled');
						interface.vars.selectedWorld = $(`#${event.target.value}-world`);
					}
				})
				setTimeout(() => $(event.target).addClass('active'), 0);
				interface.vars.setup.worldSelected();
			},
			updateUsername: () => {
				if ( interface.vars.setup.nameSelected ) {
					interface.vars.setup.nameSelected();
					interface.vars.setup.nameSelected = null;
				}
			},
			setupDone: () => {
				interface.actions.showPage().then(interface.handlers.pageShown);
			},
			pageShown: () => {
				interface.actions.startGame();
			}
		}
	};

	Object.defineProperty(race, "profession", {enumerable: true, configurable: false,
		set: (v) => {
			if ( !game.prof ) {
				game.prof = v;
			}
		},
		get: () => prof.name
	});

	global.RatRace = race;

	$(() => {
		interface.actions.setup().then(interface.handlers.setupDone);
	});
})(window, $);