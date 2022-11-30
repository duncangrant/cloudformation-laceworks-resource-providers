import {AbstractLaceworkResource} from "../../Lacework-Common/src/abstract-lacework-resource"
import {exceptions} from "@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib";
import {LaceworkClient} from "../../Lacework-Common/src/lacework-client"
import {ResourceModel, TypeConfigurationModel} from './models';
import {version} from "../package.json";
import {CaseTransformer, Transformer} from "../../Lacework-Common/src/util";

interface CallbackContext extends Record<string, any> {}

type CloudAccount = {
    data: any
}

type CloudAccounts = {
    data: any[]
}
class Resource extends AbstractLaceworkResource<ResourceModel, ResourceModel, ResourceModel, ResourceModel, TypeConfigurationModel> {
    private userAgent = `AWS CloudFormation (+https://aws.amazon.com/cloudformation/) CloudFormation resource ${this.typeName}/${version}`;

    async create(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<ResourceModel> {
        let parse = JSON.parse(model.data);

        let transform = Transformer.for({...model.toJSON(), data: parse})
            .transformKeys(CaseTransformer.PASCAL_TO_CAMEL)
            .transform();

        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent, this.loggerProxy).doRequest<any>(
            'post',
            `/CloudAccounts`,
            null, {...transform});

        return new ResourceModel(Transformer.for(response.data.data)
            .transformKeys(CaseTransformer.IDENTITY)
            .forModelIngestion()
            .transform());
    }

    async update(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<ResourceModel> {
        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent).doRequest<CloudAccount>(
            'patch',
            `/CloudAccounts/${model.intgGuid}`,
            null, {
                ...Transformer.for(model.toJSON())
                    .transformKeys(CaseTransformer.PASCAL_TO_CAMEL)
                    .transform()
            });

        return new ResourceModel(Transformer.for(response.data.data)
            .transformKeys(CaseTransformer.IDENTITY)
            .forModelIngestion()
            .transform());
    }

    async delete(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<void> {
        if (!model.intgGuid) {
            throw new exceptions.NotFound(this.typeName, null);
        }

        await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent).doRequest<void>(
            'delete',
            `/CloudAccounts/${model.intgGuid}`,
            null, null);
    }

    async get(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<ResourceModel> {
        if (!model.intgGuid) {
            throw new exceptions.NotFound(this.typeName, null);
        }

        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent).doRequest<CloudAccount>(
            'get',
            `/CloudAccounts/${model.intgGuid}`,
            null, null);

        return new ResourceModel(Transformer.for(response.data.data)
            .transformKeys(CaseTransformer.IDENTITY)
            .forModelIngestion()
            .transform());
    }

    async list(model: ResourceModel, typeConfiguration: TypeConfigurationModel | undefined): Promise<ResourceModel[]> {
        const response = await new LaceworkClient(typeConfiguration.laceworkAccess, this.userAgent).doRequest<CloudAccounts>(
            'get',
            `/CloudAccounts`,
            null, null);


        if(!response.data.data) {
            return [];
        }

        return response.data.data.map(group => {
            const resourceModel = new ResourceModel(
                    Transformer.for(group)
                        .transformKeys(CaseTransformer.IDENTITY)
                        .forModelIngestion().transform());
            return this.setModelFrom(new ResourceModel(), resourceModel);
        });
    }

    newModel(partial: any): ResourceModel {
        return new ResourceModel(partial);
    }

    setModelFrom(model: ResourceModel, from: ResourceModel | undefined): ResourceModel {
        if (!from) {
            return model;
        }

        delete from.data;

        let resourceModel = new ResourceModel({
            intgGuid: model.intgGuid,
            ...Transformer.for(from)
                .forModelIngestion()
                .transformKeys(CaseTransformer.IDENTITY)
                .transform()
        });

        this.loggerProxy.log(`!!!!! DJG ----- Set Model from output  ${resourceModel.toJSON()}`);
        return resourceModel;
    }

}

// @ts-ignore // if running against v1.0.1 or earlier of plugin the 5th argument is not known but best to ignored (runtime code may warn)
export const resource = new Resource(ResourceModel.TYPE_NAME, ResourceModel, null, null, TypeConfigurationModel)!;

// Entrypoint for production usage after registered in CloudFormation
export const entrypoint = resource.entrypoint;

// Entrypoint used for local testing
export const testEntrypoint = resource.testEntrypoint;
