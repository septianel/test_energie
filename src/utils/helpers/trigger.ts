import func from './function'
import { QueryRunner } from 'typeorm'
import * as _Records from 'app/records'


const Records = Object.values(_Records).map(record => {
	try {
		const instanceRecord = new record.default()
		const schema = record.default['table']['schema']
		const table = record.default['table']['name']
		return {
			schema,
			table,
			trigger: instanceRecord['trigger']() as TriggerInterface,
		}
	} catch (e) {
		return null
	}
}).filter(i => !!i)


interface TriggerModel {
	name: string
	time: 'BEFORE' | 'AFTER'
	method: Array<'UPDATE' | 'INSERT' | 'DELETE'>,
	query: string | ((qR: QueryRunner) => Promise<string>)
	variable?: string
	delete?: boolean
}

const queries: (TriggerModel & {
	triggerOnTable: string[],
	name: string
})[] = [
		{
			name: 'set_destionation_sicepat_location',
			triggerOnTable: ['master.location'],
			method: ['UPDATE'],
			delete: true,
			time: 'BEFORE',
			query: `
		NEW.destination_id = (SELECT
		s.id
		FROM AREA.sicepat s
		WHERE
		(s.subdistrict ILIKE ('%' || NULLIF(OLD.suburb_name, '') || '%')  OR s.subdistrict ILIKE ('%' || NULLIF(OLD.suburb_alias, '') || '%'))
		AND s.city ILIKE ('%' || NULLIF(OLD.city_name, '') || '%')
		LIMIT 1);`
		},
		{
			name: 'delete_cart_item',
			triggerOnTable: ['app.cart_item'],
			method: ['UPDATE'],
			delete: true,
			time: 'AFTER',
			query: `
		IF (NEW.deleted_at IS NOT NULL) THEN
		UPDATE app.cart_item
		SET
		deleted_at = NEW.deleted_at
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND deleted_at IS NULL;
		END IF;`,
		},
		{
			name: 'order_cart_item',
			triggerOnTable: ['app.cart_item'],
			method: ['UPDATE'],
			delete: true,
			time: 'AFTER',
			query: `
		IF (NEW.ordered_at IS NOT NULL) THEN
		UPDATE app.cart_item
		SET
		deleted_at = NEW.ordered_at
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		END IF;`,
		},
		{
			name: 'add_cart_item',
			triggerOnTable: ['app.cart_item'],
			method: ['INSERT'],
			delete: true,
			time: 'AFTER',
			query: `
		UPDATE app.cart_item
		SET
		quantity = COALESCE((SELECT ci.quantity FROM app.cart_item ci WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL ORDER BY ci.id DESC OFFSET 1 LIMIT 1), 0) + NEW.quantity
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		`,
		},
		{
			name: 'update_cart_item',
			triggerOnTable: ['app.cart_item'],
			method: ['UPDATE'],
			delete: true,
			time: 'AFTER',
			query: `
		UPDATE app.cart_item
		SET
		quantity = NEW.quantity
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		`,
		},
		{
			name: 'order_cart_item_by_order',
			triggerOnTable: ['app.order_detail'],
			method: ['INSERT'],
			delete: true,
			time: 'AFTER',
			query: `
		UPDATE app.cart_item
		SET
		ordered_at = NOW()
		WHERE cart_id = (SELECT "cart".id from app.cart "cart" WHERE "cart".user_id = (SELECT "order".user_id from app.order "order" where "order".id = NEW.order_id limit 1) limit 1) AND type::TEXT = NEW.type::TEXT AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;`
		},
		{
			name: 'set_variant_status',
			triggerOnTable: ['app.variant'],
			method: ['INSERT', 'UPDATE'],
			delete: true,
			time: 'BEFORE',
			query: async () => {
				return `
			NEW.option_1 = LOWER(TRIM(NEW.option_1));
			NEW.option_2 = LOWER(TRIM(NEW.option_2));
			NEW.updated_at = NOW();

			IF(COUNT((select type.id from app.variant_type type where type.product_id = NEW.product_id limit 1)) < 1) THEN
			RAISE EXCEPTION 'cannot set variant without variant_type';
			END IF;

			IF(NEW.option_2 IS NOT NULL AND NEW.option_1 = '') THEN
			RAISE EXCEPTION 'cannot set option_2 when option_1 IS EMPTY';
			END IF;

			IF(NEW.deleted_at IS NOT NULL) THEN
			NEW.status = 'UNAVAILABLE';
			END IF;

			IF ((select type.type_1 from app.variant_type type where type.product_id = NEW.product_id limit 1) IS NULL) THEN

			IF(NEW.option_1 = '') THEN
			NEW.status = 'AVAILABLE';
			NEW.deleted_at = NULL;
			ELSE
			NEW.status = 'UNAVAILABLE';
			NEW.deleted_at = NOW();
			END IF;

			ELSE

			IF(NEW.option_1 = '') THEN
			NEW.status = 'UNAVAILABLE';
			NEW.deleted_at = NOW();
			END IF;

			END IF;`
			}
		},
		{
			name: 'set_variant_type',
			triggerOnTable: ['app.variant_type'],
			method: ['INSERT', 'UPDATE'],
			delete: true,
			time: 'AFTER',
			query: async () => {
				return `
			NEW.type_1 = TRIM(LOWER(NEW.type_1));
			NEW.type_2 = TRIM(LOWER(NEW.type_2));
			IF(NEW.type_2 IS NOT NULL AND NEW.type_1 IS NULL) THEN
			RAISE EXCEPTION 'cannot set type_2 when type_1 IS NULL';
			END IF;

			IF(NEW.type_1 IS NULL) THEN

			UPDATE app.variant
			SET
			deleted_at = NULL,
			status = 'AVAILABLE'
			WHERE product_id = NEW.product_id AND option_1 = '';
			UPDATE app.variant
			SET
			status = 'UNAVAILABLE',
			deleted_at = NOW()
			WHERE product_id = NEW.product_id AND option_1 <> '';

			ELSE

			UPDATE app.variant
			SET
			deleted_at = NOW(),
			status = 'UNAVAILABLE'
			WHERE product_id = NEW.product_id AND option_1 = '';

			END IF;
			`
			}
		},
	]

// -------------------------------------------------------------------------------------------------------
async function createFunctionTrigger({
	schema,
	table,
	trigger
}: {
	schema: string,
	table: string,
	trigger: TriggerModel
}, qR: QueryRunner) {

	const func_name = `"function".func_trigger_${trigger.name}_${schema}_${table}()`
	const drop = `DROP FUNCTION IF EXISTS ${func_name} CASCADE;`
	const variable = trigger.variable ? `DECLARE ` + trigger.variable : ''
	const create = `CREATE FUNCTION ${func_name} RETURNS TRIGGER
			AS $$
			${variable}
			BEGIN
			${typeof trigger.query === 'string' ? trigger.query : await trigger.query(qR)}
			RETURN NEW;
			END
			$$
			LANGUAGE PLPGSQL;`
	if (trigger.delete) {
		return func.formatSpace(drop)
	} else {
		return func.formatSpace(drop + create)
	}
}

function createTrigger({
	schema,
	table,
	trigger
}: {
	schema: string,
	table: string,
	trigger: TriggerModel
}) {
	const name = `trigger_${trigger.name}`
	const func_name = `"function".func_trigger_${trigger.name}_${schema}_${table}()`
	const drop = `DROP TRIGGER IF EXISTS ${name} ON "${schema}"."${table}" CASCADE;`
	const create = `CREATE TRIGGER ${name}
				${trigger.time} ${trigger.method.join(' OR ')} ON "${schema}"."${table}"
				FOR EACH ROW
				WHEN (pg_trigger_depth() = 0)
				EXECUTE PROCEDURE ${func_name};`
	if (trigger.delete) {
		return func.formatSpace(drop)
	} else {
		return func.formatSpace(drop + create)
	}
}

queries.forEach(i => i)

export type TriggerInterface = Promise<TriggerModel[]>

export default {

	async createTRIGGER(qR: QueryRunner) {
		return await Promise.all(Object.values(Records).map(async Record => {
			const schema = Record.schema
			const table = Record.table
			const triggers = await Record.trigger

			return await Promise.all(triggers.map(async trigger => [
				await createFunctionTrigger({ schema, table, trigger }, qR),
				createTrigger({ schema, table, trigger }),
			]))

		}))
	},

}
