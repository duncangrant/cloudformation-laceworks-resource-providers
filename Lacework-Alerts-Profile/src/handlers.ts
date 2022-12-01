import {AbstractLaceworkResource} from "../../Lacework-Common/src/abstract-lacework-resource"
import {exceptions} from "@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib";
import {LaceworkClient} from "../../Lacework-Common/src/lacework-client"
import {ResourceModel, TypeConfigurationModel} from './models';
import {version} from "../package.json";
import {CaseTransformer, Transformer} from "../../Lacework-Common/src/util";

interface CallbackContext extends Record<string, any> {}

type AlertProfile = {
    descriptionKeys: any;
    fields: any;
    data: any
}

type AlertProfiles = {
    data: any[]
}
class Resource extends AbstractLaceworkResource<ResourceModel, AlertProfile, AlertProfile, AlertProfile, TypeConfigurationModel> {
    private userAgent = `AWS CloudFormation (+https://aws.amazon.com/cloudformation/) CloudFormation resource ${this.typeName}/${version}`;

    async create(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<AlertProfile> {
        let transform = Transformer.for(model.toJSON())
            .transformKeys(CaseTransformer.PASCAL_TO_CAMEL)
            .transform();

        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<any>(
            'post',
            `/AlertProfiles`,
            null, {...transform});

        return response.data.data;
    }

    async update(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<AlertProfile> {
        const body = new ResourceModel({...model});
        delete body.alertProfileId;
        delete body.extends_;

        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<AlertProfile>(
            'patch',
            `/AlertProfiles/${(model.alertProfileId)}`,
            null, {
                ...Transformer.for(body.toJSON())
                    .transformKeys(CaseTransformer.PASCAL_TO_CAMEL)
                    .transform()
            });

        return response.data.data;
    }

    async delete(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<void> {
        if (!model.alertProfileId) {
            throw new exceptions.NotFound(this.typeName, null);
        }

        await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<void>(
            'delete',
            `/AlertProfiles/${model.alertProfileId}`,
            null, null);
    }

    async get(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<AlertProfile> {
        if (!model.alertProfileId) {
            throw new exceptions.NotFound(this.typeName, null);
        }

        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<AlertProfile>(
            'get',
            `/AlertProfiles/${model.alertProfileId}`,
            null, null);

        return response.data.data;
    }

    async list(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<ResourceModel[]> {
        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<AlertProfiles>(
            'get',
            `/AlertProfiles`,
            null, null);


        if(!response.data.data) {
            return [];
        }

        return response.data.data.map(group => this.setModelFrom(new ResourceModel(), group));
    }

    newModel(partial: any): ResourceModel {
        return new ResourceModel(partial);
    }

    setModelFrom(model: ResourceModel, from: AlertProfile | undefined): ResourceModel {
        if (!from) {
            return model;
        }

        delete from.fields;
        delete from.descriptionKeys;

        let resourceModel = new ResourceModel({
            alertProfileId: model.alertProfileId,
            ...Transformer
                .for(from)
                .transformKeys(CaseTransformer.IDENTITY)
                .forModelIngestion()
                .transform()
        });

        delete resourceModel.alerts;


        this.loggerProxy.log(`!!!!! DJG ${JSON.stringify(resourceModel.toJSON())}`);

        return resourceModel;
    }

}

// @ts-ignore // if running against v1.0.1 or earlier of plugin the 5th argument is not known but best to ignored (runtime code may warn)
export const resource = new Resource(ResourceModel.TYPE_NAME, ResourceModel, null, null, TypeConfigurationModel)!;

// Entrypoint for production usage after registered in CloudFormation
export const entrypoint = resource.entrypoint;

// Entrypoint used for local testing
export const testEntrypoint = resource.testEntrypoint;
