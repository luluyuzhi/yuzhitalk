import { InstantiationService } from 'yuzhi/instantiation/common/instantiationService';
import { SyncDescriptor } from 'yuzhi/instantiation/common/descriptors';
import { ServiceCollection } from 'yuzhi/instantiation/common/serviceCollection';
import { IProtocol, Protocol, IProtocolHock, ProtocolHockServer } from 'yuzhi/protocol/protocol';
import { NetService } from 'yuzhi/core/server';
import { IInstantiationService } from 'yuzhi/instantiation/common/instantiation';
import { options } from 'yuzhi/option';
import { IProtocolCollocationServer, ProtocolCollocationServer } from 'yuzhi/protocol/statemachines';

class CoreMain {
    main(): void {
        try {
            this.startup();
        } catch (error) {
            console.error(error.message);
        }
    }

    private async startup(): Promise<void> {
        const instantiationService = this.createServices();
        instantiationService.invokeFunction((accessor) =>{
            instantiationService.createInstance(NetService, options).Start();
        });
    }

    private createServices(): IInstantiationService {
        let collection = new ServiceCollection();
        collection.set(IProtocolHock, new SyncDescriptor<IProtocolHock>(ProtocolHockServer))
        collection.set(IProtocol, new SyncDescriptor<IProtocol>(Protocol));
        collection.set(IProtocolCollocationServer, new SyncDescriptor<IProtocolCollocationServer>(ProtocolCollocationServer))
        return new InstantiationService(collection);
    }
}

const coreMain = new CoreMain();

coreMain.main();